import { useState, useCallback, useEffect, useRef } from 'react';
import { validateImageFile } from '@/utils/imageUtils';

export interface ColorInfo {
    hex: string;
    rgb: { r: number; g: number; b: number };
    hsl: { h: number; s: number; l: number };
    cmyk: { c: number; m: number; y: number; k: number };
    x?: number;
    y?: number;
}

export function useColorPicker() {
    const [image, setImage] = useState<HTMLImageElement | null>(null);
    const [originalFile, setOriginalFile] = useState<File | null>(null);
    const [hoverColor, setHoverColor] = useState<ColorInfo | null>(null);
    const [selectedColor, setSelectedColor] = useState<ColorInfo | null>(null);
    const [colorHistory, setColorHistory] = useState<string[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [isEyeDropperActive, setIsEyeDropperActive] = useState(true);
    const [hasNativeEyeDropper, setHasNativeEyeDropper] = useState(false);

    const canvasRef = useRef<HTMLCanvasElement>(null);
    const contextRef = useRef<CanvasRenderingContext2D | null>(null);

    // Detect native EyeDropper API support
    useEffect(() => {
        if (typeof window !== 'undefined' && 'EyeDropper' in window) {
            setHasNativeEyeDropper(true);
        }
    }, []);

    // Helper: RGB to HEX
    const rgbToHex = (r: number, g: number, b: number) => {
        return "#" + [r, g, b].map(x => {
            const hex = x.toString(16);
            return hex.length === 1 ? "0" + hex : hex;
        }).join("");
    };

    // Helper: RGB to HSL
    const rgbToHsl = (r: number, g: number, b: number) => {
        r /= 255; g /= 255; b /= 255;
        const max = Math.max(r, g, b), min = Math.min(r, g, b);
        let h = 0, s = 0, l = (max + min) / 2;

        if (max !== min) {
            const d = max - min;
            s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
            switch (max) {
                case r: h = (g - b) / d + (g < b ? 6 : 0); break;
                case g: h = (b - r) / d + 2; break;
                case b: h = (r - g) / d + 4; break;
            }
            h /= 6;
        }

        return {
            h: Math.round(h * 360),
            s: Math.round(s * 100),
            l: Math.round(l * 100)
        };
    };

    // Helper: RGB to CMYK
    const rgbToCmyk = (r: number, g: number, b: number) => {
        const cPrime = 1 - (r / 255);
        const mPrime = 1 - (g / 255);
        const yPrime = 1 - (b / 255);
        const k = Math.min(cPrime, Math.min(mPrime, yPrime));
        if (k === 1) return { c: 0, m: 0, y: 0, k: 100 };
        const c = Math.round(((cPrime - k) / (1 - k)) * 100);
        const m = Math.round(((mPrime - k) / (1 - k)) * 100);
        const y = Math.round(((yPrime - k) / (1 - k)) * 100);
        return { c, m, y, k: Math.round(k * 100) };
    };

    // Helper: HEX to RGB
    const hexToRgb = (hex: string) => {
        let cleanHex = hex.replace('#', '');
        if (cleanHex.length === 3) {
            cleanHex = cleanHex.split('').map(c => c + c).join('');
        }
        const num = parseInt(cleanHex, 16);
        return {
            r: (num >> 16) & 255,
            g: (num >> 8) & 255,
            b: num & 255
        };
    };

    const loadFile = useCallback(async (file: File) => {
        try {
            setError(null);
            const validation = validateImageFile(file, 20);
            if (!validation.valid) {
                setError(validation.error || 'Invalid file');
                return;
            }

            setOriginalFile(file);
            const img = new Image();
            img.onload = () => setImage(img);
            img.onerror = () => setError('Failed to load image');
            img.src = URL.createObjectURL(file);
        } catch (err) {
            console.error('Failed to load image:', err);
            setError('Failed to load image');
        }
    }, []);

    // Initialize canvas when image loads
    useEffect(() => {
        if (image && canvasRef.current) {
            const canvas = canvasRef.current;
            const ctx = canvas.getContext('2d', { willReadFrequently: true });

            if (ctx) {
                canvas.width = image.width;
                canvas.height = image.height;
                ctx.drawImage(image, 0, 0);
                contextRef.current = ctx;
            }
        }
    }, [image]);

    const pickColor = useCallback((x: number, y: number, isClick: boolean = false) => {
        if (!contextRef.current || !image) return;

        const imgX = Math.max(0, Math.min(Math.floor(x), image.width - 1));
        const imgY = Math.max(0, Math.min(Math.floor(y), image.height - 1));

        const pixelFn = contextRef.current.getImageData(imgX, imgY, 1, 1).data;
        const [r, g, b] = pixelFn;

        const hex = rgbToHex(r, g, b);
        const hsl = rgbToHsl(r, g, b);
        const cmyk = rgbToCmyk(r, g, b);

        const colorInfo: ColorInfo = {
            hex,
            rgb: { r, g, b },
            hsl,
            cmyk,
            x: imgX,
            y: imgY
        };

        if (isClick) {
            setSelectedColor(colorInfo);
            setColorHistory(prev => {
                const newHistory = [hex, ...prev.filter(c => c.toLowerCase() !== hex.toLowerCase())].slice(0, 12);
                return newHistory;
            });
        } else {
            setHoverColor(colorInfo);
        }
    }, [image]);

    const pickColorFromHex = useCallback((hex: string) => {
        try {
            const rgb = hexToRgb(hex);
            const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
            const cmyk = rgbToCmyk(rgb.r, rgb.g, rgb.b);
            const formattedHex = hex.startsWith('#') ? hex : `#${hex}`;

            const colorInfo: ColorInfo = {
                hex: formattedHex,
                rgb,
                hsl,
                cmyk
            };

            setSelectedColor(colorInfo);
            setColorHistory(prev => {
                const newHistory = [formattedHex, ...prev.filter(c => c.toLowerCase() !== formattedHex.toLowerCase())].slice(0, 12);
                return newHistory;
            });
        } catch (e) {
            console.error('Invalid hex format:', e);
        }
    }, []);

    // Native EyeDropper API trigger
    const openNativeEyeDropper = useCallback(async () => {
        if (typeof window !== 'undefined' && 'EyeDropper' in window) {
            try {
                const EyeDropperClass = (window as any).EyeDropper;
                const eyeDropper = new EyeDropperClass();
                const result = await eyeDropper.open();
                if (result?.sRGBHex) {
                    pickColorFromHex(result.sRGBHex);
                }
            } catch (err) {
                // User aborted selection
            }
        }
    }, [pickColorFromHex]);

    const reset = useCallback(() => {
        setImage(null);
        setOriginalFile(null);
        setHoverColor(null);
        setSelectedColor(null);
        setColorHistory([]);
        setError(null);
    }, []);

    return {
        image,
        canvasRef,
        hoverColor,
        selectedColor,
        colorHistory,
        isEyeDropperActive,
        setIsEyeDropperActive,
        hasNativeEyeDropper,
        openNativeEyeDropper,
        error,
        loadFile,
        pickColor,
        pickColorFromHex,
        reset
    };
}


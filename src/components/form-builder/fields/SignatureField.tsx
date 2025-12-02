'use client';

import React, { useRef, useState, useEffect } from 'react';
import { Button } from '@/components/ui/primitives/Button';
import { RotateCcw } from 'lucide-react';
import styles from './SignatureField.module.scss';

interface SignatureFieldProps {
  value: string;
  onChange?: (value: string) => void;
  disabled?: boolean;
}

export default function SignatureField({ value, onChange, disabled = false }: SignatureFieldProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [isEmpty, setIsEmpty] = useState(true);

  useEffect(() => {
    // Load existing signature if value is provided
    if (value && canvasRef.current) {
      const ctx = canvasRef.current.getContext('2d');
      if (ctx) {
        const img = new Image();
        img.onload = () => {
          ctx.drawImage(img, 0, 0);
          setIsEmpty(false);
        };
        img.src = value;
      }
    }
  }, []);

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    setIsDrawing(true);
    setIsEmpty(false);

    const rect = canvas.getBoundingClientRect();
    const x = 'touches' in e ? e.touches[0].clientX - rect.left : e.clientX - rect.left;
    const y = 'touches' in e ? e.touches[0].clientY - rect.top : e.clientY - rect.top;

    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = 'touches' in e ? e.touches[0].clientX - rect.left : e.clientX - rect.left;
    const y = 'touches' in e ? e.touches[0].clientY - rect.top : e.clientY - rect.top;

    ctx.lineTo(x, y);
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.stroke();
  };

  const stopDrawing = () => {
    if (!isDrawing) return;
    setIsDrawing(false);

    const canvas = canvasRef.current;
    if (!canvas) return;

    // Save signature as base64
    const dataUrl = canvas.toDataURL('image/png');
    onChange?.(dataUrl);
  };

  const clearSignature = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setIsEmpty(true);
    onChange?.('');
  };

  return (
    <div className={styles.signatureField}>
      <canvas
        ref={canvasRef}
        width={600}
        height={200}
        className={styles.canvas}
        onMouseDown={disabled ? undefined : startDrawing}
        onMouseMove={disabled ? undefined : draw}
        onMouseUp={disabled ? undefined : stopDrawing}
        onMouseLeave={disabled ? undefined : stopDrawing}
        onTouchStart={disabled ? undefined : startDrawing}
        onTouchMove={disabled ? undefined : draw}
        onTouchEnd={disabled ? undefined : stopDrawing}
        style={disabled ? { opacity: 0.5, cursor: 'not-allowed' } : undefined}
      />
      {isEmpty && (
        <div className={styles.placeholder}>
          Sign here
        </div>
      )}
      <div className={styles.actions}>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={clearSignature}
          disabled={isEmpty || disabled}
        >
          <RotateCcw size={16} />
          Clear
        </Button>
      </div>
    </div>
  );
}

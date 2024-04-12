function rgbToHex(rgba : [number, number, number, number]) {
    const hexR = (rgba[0] * 255).toString(16).padStart(2, '0');
    const hexG = (rgba[1] * 255).toString(16).padStart(2, '0');
    const hexB = (rgba[2] * 255).toString(16).padStart(2, '0');

    // Concatenate the hexadecimal components
    const hexColor = `#${hexR}${hexG}${hexB}`;

    return hexColor;
}
  
function hexToRgb(hex: string): [number, number, number, number] {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
  
    return [r / 255, g / 255, b / 255, 1];
}
  
export { rgbToHex, hexToRgb };
  
// Botones − y + de los selectores de cantidad (funciona sin esto: también se puede escribir el número).
document.querySelectorAll('.qty').forEach((group) => {
  const input = group.querySelector('input[type="number"]');
  const [minus, plus] = group.querySelectorAll('button');
  if (!input || !minus || !plus) return;

  const min = Number(input.min) || 1;
  const max = Number(input.max) || 10;
  const clamp = (n) => Math.min(max, Math.max(min, n));

  minus.addEventListener('click', () => { input.value = clamp((Number(input.value) || min) - 1); });
  plus.addEventListener('click', () => { input.value = clamp((Number(input.value) || min) + 1); });
});

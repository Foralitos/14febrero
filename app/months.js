export const MONTHS = [
  { id: "enero", number: "01", name: "ENERO", flower: "¿?", image: null, locked: true },
  {
    id: "febrero",
    number: "02",
    name: "FEBRERO",
    flower: "Girasoles",
    image: "/Siimg.png",
    locked: false,
  },
  {
    id: "marzo",
    number: "03",
    name: "MARZO",
    flower: "Flores silvestres",
    image: "/floresAmarillas.png",
    locked: false,
  },
  { id: "abril", number: "04", name: "ABRIL", flower: "¿?", image: null, locked: true },
  { id: "mayo", number: "05", name: "MAYO", flower: "¿?", image: null, locked: true },
  { id: "junio", number: "06", name: "JUNIO", flower: "¿?", image: null, locked: true },
  { id: "julio", number: "07", name: "JULIO", flower: "¿?", image: null, locked: true },
  { id: "agosto", number: "08", name: "AGOSTO", flower: "¿?", image: null, locked: true },
  { id: "septiembre", number: "09", name: "SEPTIEMBRE", flower: "¿?", image: null, locked: true },
  { id: "octubre", number: "10", name: "OCTUBRE", flower: "¿?", image: null, locked: true },
  { id: "noviembre", number: "11", name: "NOVIEMBRE", flower: "¿?", image: null, locked: true },
  { id: "diciembre", number: "12", name: "DICIEMBRE", flower: "¿?", image: null, locked: true },
];

export function getMonth(id) {
  return MONTHS.find((m) => m.id === id) ?? null;
}

import { assets } from '../assets/assets';

export const gamesConfig = {
  bst: {
    label: 'Árbol Binario de Búsqueda',
    icon: assets.BST,
    route: '/ejercicio/seleccion',
    state: {
      mode: 'normal',
      timer: 60,
      heapType: null, // no aplica
    },
  },
  hashingex: {
    label: 'Hash Extensible',
    icon: assets.Hash,
    route: '/ejercicio/seleccion',
    state: {
      mode: 'normal',
      timer: 60,
      heapType: null,
    },
  },
  heapgame: {
    label: 'Max-Heap y Min-Heap',
    icon: assets.Heap,
    route: '/ejercicio/seleccion',
    state: {
      mode: 'normal',
      timer: 60,
      heapType: 'max',
    },
  },
};

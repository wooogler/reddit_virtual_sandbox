const palette = {
  /* gray */
  gray: [
    '#f8f9fa',
    '#f1f3f5',
    '#e9ecef',
    '#dee2e6',
    '#ced4da',
    '#adb5bd',
    '#868e96',
    '#495057',
    '#343a40',
    '#212529',
  ],
  red: [
    '#fff5f5',
    '#ffe3e3',
    '#ffc9c9',
    '#ffa8a8',
    '#ff8787',
    '#ff6b6b',
    '#fa5252',
    '#f03e3e',
    '#e03131',
    '#c92a2a',
  ],
  orange: [
    '#fff4e6',
    '#ffe8cc',
    '#ffd8a8',
    '#ffc078',
    '#ffa94d',
    '#ff922b',
    '#fd7e14',
    '#f76707',
    '#e8590c',
    '#d9480f',
  ],
  blue: [
    '#e7f5ff',
    '#d0ebff',
    '#a5d8ff',
    '#74c0fc',
    '#4dabf7',
    '#339af0',
    '#228be6',
    '#1c7ed6',
    '#1971c2',
    '#1864ab',
  ],
};

export const actionColorMap = {
  remove: {
    background: palette.red[2],
    color: palette.red[7],
  },
  report: {
    background: palette.orange[2],
    color: palette.red[7],
  },
};

export const buttonColorMap : {
  [color: string]: {
    background: string;
    color: string;
    hoverBackground: string;
  };
} = {
  blue: {
    background: palette.blue[6],
    color: 'white',
    hoverBackground: palette.blue[5],
  },
  red: {
    background: palette.red[5],
    color: 'white',
    hoverBackground: palette.red[4]
  }
}

export default palette;

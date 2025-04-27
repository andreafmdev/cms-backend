export const TEST_CONSTANTS = {
  LANGUAGE_CODE: {
    IT: 'it',
    EN: 'en',
  },
  PRODUCT: {
    PRICE: 1000,
    TRANSLATIONS: {
      IT: {
        NAME: 'Pianoforti',
        DESCRIPTION: 'Grande pianoforte classico',
        LANGUAGE_CODE: 'it',
      },
      EN: {
        NAME: 'Grand Piano',
        DESCRIPTION: 'Classic grand piano',
        LANGUAGE_CODE: 'en',
      },
    },
    IS_AVAILABLE: true,
    IMAGES: [
      {
        URL: 'https://example.com/image.jpg',
        ALT: 'Pianoforte',
        IS_MAIN: true,
      },
      {
        URL: 'https://example.com/image2.jpg',
        ALT: 'Pianoforte 2',
        IS_MAIN: false,
      },
    ],
    BRAND_ID: '1',
    CATEGORY_ID: '1',
    ATTRIBUTES: {
      SIZE: {
        TRANSLATIONS: {
          IT: {
            VALUE: 'Dimensioni',
            LANGUAGE_CODE: 'it',
          },
          EN: {
            VALUE: 'Dimensions',
            LANGUAGE_CODE: 'en',
          },
        },
      },
      COLOR: {
        TRANSLATIONS: {
          IT: {
            VALUE: 'Colore',
            LANGUAGE_CODE: 'it',
          },
          EN: {
            VALUE: 'Color',
            LANGUAGE_CODE: 'en',
          },
        },
      },
    },
  },
  CATEGORY: {
    PIANOS: {
      TRANSLATIONS: {
        IT: {
          NAME: 'Pianoforti',
          DESCRIPTION: 'Grande pianoforte classico',
          LANGUAGE_CODE: 'it',
        },
        EN: {
          NAME: 'Grand Piano',
          DESCRIPTION: 'Classic grand piano',
          LANGUAGE_CODE: 'en',
        },
      },
      ATTRIBUTES: {
        SIZE: {
          TRANSLATIONS: {
            IT: {
              VALUE: 'Dimensioni',
              LANGUAGE_CODE: 'it',
            },
            EN: {
              VALUE: 'Size',
              LANGUAGE_CODE: 'en',
            },
          },
        },
        COLOR: {
          TRANSLATIONS: {
            IT: {
              VALUE: 'Colore',
              LANGUAGE_CODE: 'it',
            },
            EN: {
              VALUE: 'Color',
              LANGUAGE_CODE: 'en',
            },
          },
        },
      },
    },
  },

  BRAND: {
    YAMAHA: {
      NAME: 'Yamaha',
    },
    KAWAI: {
      NAME: 'Kawai',
    },
  },
};

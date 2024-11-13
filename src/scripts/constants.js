const CONSTANTS = {
    MODULE_ID: "Border-Control",
    PATH: `modules/Border-Control/`,
    FLAGS: {
        BORDER_DRAW_FRAME: "borderDrawFrame", //'draw-frame',
        BORDER_DISABLE: "noBorder", // "borderDisable", // 'disable'
        // BORDER_NO_BORDER: "noBorder", // noBorder
        BORDER_CUSTOM_COLOR_INT: "borderCustomColorInt",
        BORDER_CUSTOM_COLOR_EXT: "borderCustomColorExt",
        BORDER_CUSTOM_FRAME_OPACITY: "borderCustomFrameOpacity",
        BORDER_CUSTOM_BASE_OPACITY: "borderCustomBaseOpacity",
    },
};

CONSTANTS.PATH = `modules/${CONSTANTS.MODULE_ID}/`;

export default CONSTANTS;

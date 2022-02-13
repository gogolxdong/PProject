const defaultState = {
    account: "",
    decentragram: null,
    images: [],
    loading: true,
};

// export default (state = defaultState, properties) => {
//     const props = Object.keys(properties);
//     props.forEach(key => {
//         state[key] = properties[key];
//     });
//     return state;
// };

export default (state = defaultState, action) => {
    if (action.type == "account") {
        state[action.type] = action.value;
    } else if (action.type == "decentragram") {
        state[action.type] = action.value;
    } else if (action.type == "images") {
        state[action.type] = action.value;
    } else if (action.type == "loading") {
        state[action.type] = action.value;
    } else if (action.type == "raised") {
        state[action.type] = action.value;
    }
    const data = Object.assign({}, state);
    return data;
};

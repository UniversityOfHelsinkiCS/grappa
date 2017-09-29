
export default function(state, action) {
    switch(action.type) {
        case "CONTRACT_SAVE_SUCCESS" :
            console.log("Talletettu onnistuneesti");
        case "CONTRACT_SAVE_FAILURE" :
            console.log("Talletus epäonnistui.");
  }
}

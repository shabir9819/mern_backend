import cors from "cors";

const corsAdapter = {
  configureCorsWithAllOptions: (options) => {
    return cors(options);
  },
};

export default corsAdapter;

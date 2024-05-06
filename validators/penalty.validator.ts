const penaltyValidator = {
  storeSchema: {
    company: {
      notEmpty: {
        errorMessage: 'Le champ "Company" est obligatoire',
      },
      isString: {
        errorMessage: 'Le champ "Company" doit être une chaîne de caractère valide',
      },
    },
    amount: {
      notEmpty: {
        errorMessage: 'Le champ "Amount" est obligatoire',
      },
    },
  },
};

export default penaltyValidator;

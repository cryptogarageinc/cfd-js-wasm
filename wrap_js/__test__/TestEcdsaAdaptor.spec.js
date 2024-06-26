const TestHelper = require('./JsonTestHelper');

const createTestFunc = (helper) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  return async (cfd, testName, req, isError) => {
    let resp;
    let request = req;
    switch (testName) {
    case 'EcdsaAdaptor.Encrypt':
      resp = cfd.EncryptEcdsaAdaptor(req);
      resp = await helper.getResponse(resp);
      resp = {...resp, signature: resp.adaptorSignature};
      break;
    case 'EcdsaAdaptor.Verify':
      request = {...req, adaptorSignature: req.signature};
      resp = cfd.VerifyEcdsaAdaptor(request);
      resp = await helper.getResponse(resp);
      resp = {valid: resp.success};
      break;
    case 'EcdsaAdaptor.Decrypt':
      request = {...req, adaptorSignature: req.signature};
      resp = cfd.DecryptEcdsaAdaptor(request);
      resp = await helper.getResponse(resp);
      break;
    case 'EcdsaAdaptor.Recover':
      resp = cfd.RecoverEcdsaAdaptor(req);
      resp = await helper.getResponse(resp);
      break;
    default:
      throw new Error('unknown name: ' + testName);
    }
    return resp;
  };
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const createCheckFunc = (helper) => {
  return (resp, exp, errorData) => {
    if (errorData) {
      const errMsg = TestHelper.getErrorMessage(errorData);
      expect(resp).toEqual(errMsg);
      return;
    }
    if (exp.signature) expect(resp.signature).toEqual(exp.signature);
    if (exp.valid) expect(resp.valid).toEqual(exp.valid);
    if (exp.secret) expect(resp.secret).toEqual(exp.secret);
  };
};

TestHelper.doTest('EcdsaAdaptor', 'key_test', createTestFunc, createCheckFunc);

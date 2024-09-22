import { IVerifyResponse, verifyCloudProof } from "@worldcoin/idkit";

export default async function handler(req, res) {
  const proof = req.body;
  const app_id = "app_staging_0a024eb570eaba23ee83642d4f601c77";
  const action = "login";
  const verifyRes = await verifyCloudProof(proof, app_id, action);

  if (verifyRes.success) {
    // This is where you should perform backend actions if the verification succeeds
    // Such as, setting a user as "verified" in a database
    res.status(200).send(verifyRes);
  } else {
    console.log(verifyRes);
    // This is where you should handle errors from the World ID /verify endpoint.
    // Usually these errors are due to a user having already verified.
    res.status(400).send(verifyRes);
  }
}

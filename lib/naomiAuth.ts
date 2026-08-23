import { createHash, timingSafeEqual } from "node:crypto";

const EXPECTED_HASH = "df0a0cb05642e1f8d0058a571607ec354acdcd20900a0472a876b1d65a2e7c8f";

export function isNaomiAuthorised(request: Request) {
  const key = request.headers.get("x-naomi-key") || "";
  const actual = Buffer.from(createHash("sha256").update(key).digest("hex"), "utf8");
  const expected = Buffer.from(EXPECTED_HASH, "utf8");
  return actual.length === expected.length && timingSafeEqual(actual, expected);
}

export function unauthorised() {
  return Response.json({ error: "Invalid Naomi access key." }, { status: 401 });
}

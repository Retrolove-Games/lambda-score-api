<img src="logo-retrolove-black.svg" width="400">

# Lambda Score API

Simple AWS Lambda API for high scores. Data sent to API is AES encrypted to fight with score tampering.

This API is 100% compatible with the [node-score-api](https://github.com/Retrolove-Games/lambda-score-api) (find more docs in this repo).

## Env vars

You need to create an environment config file to use this code:

`dev.json` and `prod.json` file format:

```json
{
  "PROJECT_NAME": "Production",
  "RDS_HOST": "*.rds.amazonaws.com",
  "RDS_USER": "*",
  "RDS_PASSWORD": "*",
  "RDS_DB": "*"
}
```

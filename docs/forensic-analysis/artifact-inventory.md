# Artifact inventory

## Target

Installation directory:

`C:\Users\DC\AppData\Local\Programs\strawberry`

## Primary artifacts

| Artifact | Size | SHA-256 |
|---|---:|---|
| `Strawberry.exe` | 236,462,800 bytes | `92B665BB242AFA795CE6AC36EAC782DFC9C28BEDBD48E4D3C72D9628E3D50EB0` |
| `resources/app.asar` | 288,522,183 bytes | `E36247B930BDA7F21587837DE137CB7CC45921F1E2428B46E20464B0379C1BBC` |

## Signature verification

The Authenticode signature on `Strawberry.exe` was reported as valid.

- Subject: Dendrite Systems Inc.
- Issuer: DigiCert Trusted G4 Code Signing RSA4096 SHA384 2021 CA1
- Certificate validity observed: 2025-08-15 through 2028-08-15
- Signing-certificate thumbprint: `E9C4ECB6EB5E13E3A0AF525F6B0316F67A64408A`

This establishes that the inspected executable carried a valid signature at analysis time. It does not independently establish that every file in the installation directory was produced by the signer.

## Extracted ASAR

- Destination: `C:\Users\DC\AppData\Local\Programs\strawberry\analysis\app-extracted`
- Extracted files: 22,577
- Extracted size: approximately 423 MB
- First-party `src` files: 5,139
- Reported package version: `0.1.25`
- Package main entry: `./out/main/index.js`

## Evidence boundaries

- Installed application binaries were not modified.
- The original `resources/app.asar` remains in place.
- Extraction created a separate analysis copy.
- No user-profile databases, cookies, passwords, recordings, or account data were collected.
- No remote Strawberry API or third-party integration was accessed during this static pass.

# Medilink

Private peer-to-peer medical data sharing application powered by Apple Healthkit, [Ethereum Attestation Service](https://attest.sh/), Account Abstraction, E2E encryption and OpenAI

<img style="width: 160px;height: 160px" src="./docs/logo.png">

# Description

MediLink is a tool for handling your private medical data and use it effectively, being able to share with your friends, family members, doctors, and hospitals in a secure way.

Currently, there are lots of people using Apple devices, enabling the Health tracker to get measurements. However, there are not many tools exist that helps you using the existing data in a useful way. With MediLink, we make your private medical data useful with power of attestations. Using MediLink you can create Medical Cards based on your available Apple Health data as attestations. The attestations are given to specific people, meaning that you can make sure the security of peer-to-peer connection. The data inside the Medical Card is encrypted asymmetrically, with the public key of attestation receiver. This allows the receiver to decrypt the data using their private key.

We provide a built-in messaging service, where you can send the previously created Medical Cards to your connections' Medical ID account addresses. Additionally, our Medical Assistant chatbot will help you to analyze your Medical Cards and give you suggestions about your health conditions.

# How we built

MediLink is mainly built with Ethereum Attestation Service (EAS), The Graph, Apple HealthKit, Safe Core and OpenAI as large language model. We can are able use the application on different L2s by deploying EAS contracts to them. Our demonstration happens in Optimism Goerli Testnet.

Using the Javascript SDK of EAS makes everything much easier on attestation creation. Using the specific schema we created for this hackathon, we can inject the encrypted user health data inside the attestation and sign for specific receivers.

## EAS Schema:

[0xa5650b1110c978afdcb61cf5fc54f0e42635e5553e43bb344d230628c48e5684](https://optimism-goerli-bedrock.easscan.org/schema/view/0xa5650b1110c978afdcb61cf5fc54f0e42635e5553e43bb344d230628c48e5684)

## Example Attestation UID

[0x73970a2e60f58806353e190d0fb5a33d84e8ab183fad63934d5ce1ce2dea70fd](https://optimism-goerli-bedrock.easscan.org/attestation/view/0x73970a2e60f58806353e190d0fb5a33d84e8ab183fad63934d5ce1ce2dea70fd)

During the first authentication, we a deploy a Safe account for a user and there is no need to remember seed phrases at all. The only thing user has to do is authenticate themselves using the FaceID. We are using the power Account Abstraction to customize the accounts. When creating attestations, the user operations are created and sent to mempool and got validated.

The Graph is use to query the attestations from Optimism Goerli using the public query URL that is provided by Ethereum Attestation Service. We consume the on-chain attestation data thanks to quick infrastructure created by The Graph.

The each attestation that is created by a user maps to Medical Card in MediLink world. To utilize these attestations, you are. able to send them to any other MediLink ID account using the Chat page of our application. Although we use a centralized MySQL database to keep your messages, they are end to end encrypted and you don't need to worry about the privacy.

Our built-in Medical Assistant can help you to analyze the Medical Cards that you created and give you suggestions about it. We used OpenAI API to get the best result using ChatGPT Large Language Models. We bring your Medical Card data into a structured prompt for the chatbot to get the overall health condition based on your Apple Health Data.

In addition to all these implementations, we are using the Covalent API to get the transaction history of a Medical ID. Thanks to the brief information that Covalent provides, users are able to see the attestation creation, modification and revocation history.

## Tech Stack

| Tech                                     | Field           |
| ---------------------------------------- | --------------- |
| [NestJS](https://nestjs.com/)            | Backend         |
| [React Native](https://reactnative.dev/) | Mobile App      |
| [EAS](https://attest.sh/)                | Attestations    |
| [Hardhat](https://hardhat.org/)          | Smart Contracts |
| [OpenAI](https://openai.com/)            | LLM             |

# Team Members

| Team Member                                    | Role       |
| ---------------------------------------------- | ---------- |
| [Farhad Asgarov](https://twitter.com/asgarovf) | Full stack |
| [Eylul Sahin](https://twitter.com/eylllsh)     | Designer   |

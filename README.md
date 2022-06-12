# NFTurtle Hackathon project

NFTurtles are issued as Proof of Contribution and Proof of Adoption.
Rewards for contributing to a real world turtle care, monitoring and rescue activities.
Every NFT has either a real world photo attached in additional metadata, for example verified divers and rangers are rewarded for finding a turtle not documented previously.
The NPO has sponsors covering turtle care expenses, other subjects can get an NFT for adopting a turtle for financial aid, that is one additional way to contribute indirectly.

Project presented in EthPrague Hackathon

This repository consists in the hardhat boilerplate to develop, compile, deploy and test the NFturtle solidity smart contract, located in `contracts` folder.

Additionally we created an ipfs service in python, that should be integrated in the NFturtle servers to process ipfs uploads after the Keras ML processing. This script is located in the folder `external/ipfs-service.py`.

Finally, we configured a generative art engine to be able to programatically create every NFTurtle image and metadata from the PNG layers. It is located in `scripts/art-gen`. This script is based on [`HashLips`](https://github.com/HashLips/hashlips_art_engine).

## Advanced Sample Hardhat Project

This project demonstrates an advanced Hardhat use case, integrating other tools commonly used alongside Hardhat in the ecosystem.

The project comes with a sample contract, a test for that contract, a sample script that deploys that contract, and an example of a task implementation, which simply lists the available accounts. It also comes with a variety of other tools, preconfigured to work with the project code.

Try running some of the following tasks:

```shell
npx hardhat accounts
npx hardhat compile
npx hardhat clean
npx hardhat test
npx hardhat node
npx hardhat help
REPORT_GAS=true npx hardhat test
npx hardhat coverage
npx hardhat run scripts/deploy.ts
TS_NODE_FILES=true npx ts-node scripts/deploy.ts
npx eslint '**/*.{js,ts}'
npx eslint '**/*.{js,ts}' --fix
npx prettier '**/*.{json,sol,md}' --check
npx prettier '**/*.{json,sol,md}' --write
npx solhint 'contracts/**/*.sol'
npx solhint 'contracts/**/*.sol' --fix
```

## Etherscan verification

To try out Etherscan verification, you first need to deploy a contract to an Ethereum network that's supported by Etherscan, such as Ropsten.

In this project, copy the .env.example file to a file named .env, and then edit it to fill in the details. Enter your Etherscan API key, your Ropsten node URL (eg from Alchemy), and the private key of the account which will send the deployment transaction. With a valid .env file in place, first deploy your contract:

```shell
hardhat run --network ropsten scripts/deploy.ts
```

Then, copy the deployment address and paste it in to replace `DEPLOYED_CONTRACT_ADDRESS` in this command:

```shell
npx hardhat verify --network ropsten DEPLOYED_CONTRACT_ADDRESS "Hello, Hardhat!"
```

## Performance optimizations

For faster runs of your tests and scripts, consider skipping ts-node's type checking by setting the environment variable `TS_NODE_TRANSPILE_ONLY` to `1` in hardhat's environment. For more details see [the documentation](https://hardhat.org/guides/typescript.html#performance-optimizations).

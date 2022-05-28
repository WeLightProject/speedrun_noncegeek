export const challengeInfo = {
  "simple-nft-example": {
    id: 0,
    branchName: "ethereum/challenge-0-simple-nft",
    label: "🚩 Challenge 0: 🎟 Simple NFT Example",
    disabled: false,
    description:
      "🎫 Create a simple NFT to learn basics of 🏗 scaffold-eth. You'll use 👷‍♀️ HardHat to compile and deploy smart contracts. Then, you'll use a template React app full of important Ethereum components and hooks. Finally, you'll deploy an NFT to a public network to share with friends! 🚀",
    previewImage: "assets/0.png",
    dependencies: [],
  },
};

export const challengeInfoStarcoin = {
  "move-contract-example": {
    id: 0,
    branchName: "starcoin/challenge-0-move-contract",
    label: "🚩 Challenge 0: 🎟 Try an Move Contract",
    disabled: false,
    description:
      "🎫 Create your first Move Contract and deploy it on Starcoin Testnet!🚀",
    previewImage: "assets/0.png",
    dependencies: [],
  },
};



const githubChallengesRepoBaseRawUrl = {
  js: "https://raw.githubusercontent.com/WeLightProject/speedrun_challenges",
  ts: "https://raw.githubusercontent.com/scaffold-eth/scaffold-eth-typescript-challenges",
};

export const getGithubChallengeReadmeUrl = (challengeId, version) =>
  `${githubChallengesRepoBaseRawUrl[version]}/${challengeInfo[challengeId].branchName}/README.md`;

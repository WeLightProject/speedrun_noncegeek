export const challengeInfo = {
  "deploy-smart-contract": {
    id: 10101,
    branchName: "ethereum/01-01-deploy-smart-contract",
    label: "🚩 Challenge 01-01: Deploy Smart Contract",
    disabled: false,
    description:
      "Deploy your first smart contract on Any Ethereum Testnet",
    previewImage: "assets/0.png",
    dependencies: [],
    submitItems: ["contractUrl"],
  },
  "variable-types": {
    id: 10102,
    branchName: "ethereum/01-02-variable-type",
    label: "🚩 Challenge 01-02: 🎟 Solidity Basic: Variable Type",
    disabled: false,
    description:
      "🎫 Learn the variable in Solidity!",
    previewImage: "assets/0.png",
    dependencies: [],
    submitItems: ["contractUrl"],
  },
};

export const challengeInfoStarcoin = {
  "move-contract-example": {
    id: 20001,
    branchName: "starcoin/challenge-0-move-contract",
    label: "🚩 Challenge 0: 🎟 Try an Move Contract",
    disabled: false,
    description:
      "🎫 Create your first Move Contract and deploy it on Starcoin Testnet!🚀",
    previewImage: "assets/0.png",
    dependencies: [],
    submitItems: ["deployedUrl", "contractUrl"],
  },
};



const githubChallengesRepoBaseRawUrl = {
  js: "https://raw.githubusercontent.com/WeLightProject/web3challenges_contents",
  ts: "https://raw.githubusercontent.com/WeLightProject/web3challenges_contents",
};

export const getGithubChallengeReadmeUrl = (challengeId, version, type) => {
  let info = getChallengeInfo(type)
  return `${githubChallengesRepoBaseRawUrl[version]}/${info[challengeId].branchName}/README.md`
}

export const getChallengeInfo = (type) => {
  let info = challengeInfo
  if (type == "starcoin") {
    info = challengeInfoStarcoin
  }
  return info
}
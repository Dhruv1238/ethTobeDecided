// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/utils/Base64.sol";

contract StepStakeDynamicNFT is ERC721URIStorage, Ownable {
    using Strings for uint256;

    // Stake information structure
    struct StakeInfo {
        uint256 amount;
        uint256 stakeTimestamp;
        uint256 stepCount;
        bool claimed;
    }

    // Mapping to track user stakes
    mapping(address => StakeInfo) public userStakes;

    // Constants
    uint256 public constant DAILY_STEP_GOAL = 5000;
    uint256 public constant STAKE_PERIOD = 1 days;

    // Token counter for NFT minting
    uint256 private _tokenIdCounter;

    // Events
    event Staked(address indexed user, uint256 amount);
    event StepsCounted(address indexed user, uint256 stepCount);
    event NFTMinted(address indexed user, uint256 tokenId);
    event StakeForfeit(address indexed user, uint256 amount);
    event DailyChallengeNFTMinted(address indexed user, uint256 tokenId);

    constructor() ERC721("DailyStepChallenge", "STEPNFT") Ownable(msg.sender) {
        _tokenIdCounter = 1;
    }

    // Stake function - allows staking with native token
    function stake() external payable {
        require(userStakes[msg.sender].amount == 0, "Already staked");
        require(msg.value > 0, "Stake amount must be greater than 0");

        userStakes[msg.sender] = StakeInfo({
            amount: msg.value,
            stakeTimestamp: block.timestamp,
            stepCount: 0,
            claimed: false
        });

        emit Staked(msg.sender, msg.value);
    }

    // Update daily steps
    function updateDailySteps(address wallet, uint256 stepCount) external {
        StakeInfo storage stakeInfo = userStakes[wallet];
        require(stakeInfo.amount > 0, "No active stake");
        require(block.timestamp - stakeInfo.stakeTimestamp < STAKE_PERIOD, "Stake period expired");

        stakeInfo.stepCount = stepCount;
        emit StepsCounted(wallet, stepCount);
    }

    // Mint NFT and claim stake if goal is met
    function claimStakeAndMintNFT(address wallet, string memory imageUrl) external {
        StakeInfo storage stakeInfo = userStakes[wallet];
        require(stakeInfo.amount > 0, "No active stake");
        require(block.timestamp - stakeInfo.stakeTimestamp <= STAKE_PERIOD, "Stake period expired");
        require(!stakeInfo.claimed, "Stake already claimed");

        if (stakeInfo.stepCount >= DAILY_STEP_GOAL) {
            uint256 newTokenId = _tokenIdCounter;
            _mintDynamicNFT(wallet, newTokenId, stakeInfo.stepCount, imageUrl);

            (bool success, ) = payable(wallet).call{ value: stakeInfo.amount }("");
            require(success, "Transfer failed");

            stakeInfo.claimed = true;
            emit NFTMinted(wallet, newTokenId);
        } else {
            (bool success, ) = payable(owner()).call{ value: stakeInfo.amount }("");
            require(success, "Forfeit transfer failed");

            emit StakeForfeit(wallet, stakeInfo.amount);
        }

        delete userStakes[wallet];
    }

    // Mint Daily Challenge NFT
    function mintDailyChallengeNFT(
        address user,
        string memory challengeType,
        string memory description,
        string memory quirkyMessage,
        string memory imageUrl
    ) external onlyOwner {
        uint256 newTokenId = _tokenIdCounter;

        string memory metadata = generateDailyChallengeMetadata(
            newTokenId,
            challengeType,
            description,
            quirkyMessage,
            imageUrl
        );

        _safeMint(user, newTokenId);
        _setTokenURI(newTokenId, metadata);

        _tokenIdCounter++;
        emit DailyChallengeNFTMinted(user, newTokenId);
    }

    // Internal function to mint NFT with dynamic metadata
    function _mintDynamicNFT(address user, uint256 tokenId, uint256 stepCount, string memory imageUrl) internal {
        string memory metadata = generateMetadata(tokenId, stepCount, imageUrl);

        _safeMint(user, tokenId);
        _setTokenURI(tokenId, metadata);

        _tokenIdCounter++;
    }

    // Generate metadata with dynamic attributes
    function generateMetadata(
        uint256 tokenId,
        uint256 stepCount,
        string memory imageUrl
    ) internal pure returns (string memory) {
        string memory metadata = string(
            abi.encodePacked(
                '{"name": "Step Challenge NFT #',
                tokenId.toString(),
                '",',
                '"description": "Daily Step Challenge Achievement",',
                '"attributes": [',
                '{"trait_type": "Steps", "value": "',
                stepCount.toString(),
                '"},',
                '{"trait_type": "Goal Achieved", "value": "',
                (stepCount >= 5000 ? "Yes" : "No"),
                '"}],"',
                '"image": "',
                imageUrl,
                '"}'
            )
        );

        return string(abi.encodePacked("data:application/json;base64,", Base64.encode(bytes(metadata))));
    }

    // Generate metadata for Daily Challenge NFT
    function generateDailyChallengeMetadata(
        uint256 tokenId,
        string memory challengeType,
        string memory description,
        string memory quirkyMessage,
        string memory imageUrl
    ) internal pure returns (string memory) {
        string memory metadata = string(
            abi.encodePacked(
                '{"name": "Daily Challenge NFT #',
                tokenId.toString(),
                '",',
                '"description": "',
                description,
                '",',
                '"attributes": [',
                '{"trait_type": "Challenge Type", "value": "',
                challengeType,
                '"},',
                '{"trait_type": "Quirky Message", "value": "',
                quirkyMessage,
                '"}],"',
                '"image": "',
                imageUrl,
                '"}'
            )
        );

        return string(abi.encodePacked("data:application/json;base64,", Base64.encode(bytes(metadata))));
    }

    // Allow contract to receive ETH
    receive() external payable {}

    // Withdraw function for contract owner
    function withdraw() external onlyOwner {
        payable(owner()).transfer(address(this).balance);
    }
}

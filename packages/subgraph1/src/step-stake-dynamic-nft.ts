import {
  Approval as ApprovalEvent,
  ApprovalForAll as ApprovalForAllEvent,
  BatchMetadataUpdate as BatchMetadataUpdateEvent,
  MetadataUpdate as MetadataUpdateEvent,
  NFTMinted as NFTMintedEvent,
  OwnershipTransferred as OwnershipTransferredEvent,
  StakeForfeit as StakeForfeitEvent,
  Staked as StakedEvent,
  StepsCounted as StepsCountedEvent,
  Transfer as TransferEvent,
} from "../generated/StepStakeDynamicNFT/StepStakeDynamicNFT";
import {
  Approval,
  ApprovalForAll,
  BatchMetadataUpdate,
  MetadataUpdate,
  NFTMinted,
  OwnershipTransferred,
  StakeForfeit,
  Staked,
  StepsCounted,
  Transfer,
  UserStake,
} from "../generated/schema";

export function handleApproval(event: ApprovalEvent): void {
  let entity = new Approval(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  );
  entity.owner = event.params.owner;
  entity.approved = event.params.approved;
  entity.tokenId = event.params.tokenId;

  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;

  entity.save();
}

export function handleApprovalForAll(event: ApprovalForAllEvent): void {
  let entity = new ApprovalForAll(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  );
  entity.owner = event.params.owner;
  entity.operator = event.params.operator;
  entity.approved = event.params.approved;

  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;

  entity.save();
}

export function handleBatchMetadataUpdate(
  event: BatchMetadataUpdateEvent
): void {
  let entity = new BatchMetadataUpdate(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  );
  entity._fromTokenId = event.params._fromTokenId;
  entity._toTokenId = event.params._toTokenId;

  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;

  entity.save();
}

export function handleMetadataUpdate(event: MetadataUpdateEvent): void {
  let entity = new MetadataUpdate(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  );
  entity._tokenId = event.params._tokenId;

  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;

  entity.save();
}

export function handleNFTMinted(event: NFTMintedEvent): void {
  let entity = new NFTMinted(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  );
  entity.user = event.params.user;
  entity.tokenId = event.params.tokenId;

  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;

  entity.save();
}

export function handleOwnershipTransferred(
  event: OwnershipTransferredEvent
): void {
  let entity = new OwnershipTransferred(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  );
  entity.previousOwner = event.params.previousOwner;
  entity.newOwner = event.params.newOwner;

  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;

  entity.save();
}

export function handleStakeForfeit(event: StakeForfeitEvent): void {
  let entity = new StakeForfeit(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  );
  entity.user = event.params.user;
  entity.amount = event.params.amount;

  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;

  entity.save();
}

export function handleStaked(event: StakedEvent): void {
  // Create Staked entity (as you already do)
  let stakedEntity = new Staked(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  );
  stakedEntity.user = event.params.user;
  stakedEntity.amount = event.params.amount;
  stakedEntity.blockNumber = event.block.number;
  stakedEntity.blockTimestamp = event.block.timestamp;
  stakedEntity.transactionHash = event.transaction.hash;
  stakedEntity.save();

  // Update aggregated UserStake entity
  let userId = event.params.user.toHex();
  let userStake = UserStake.load(userId);
  if (userStake === null) {
    userStake = new UserStake(userId);
    userStake.user = event.params.user;
    userStake.totalStaked = event.params.amount;
  } else {
    userStake.totalStaked = userStake.totalStaked.plus(event.params.amount);
  }
  userStake.save();
}

export function handleStepsCounted(event: StepsCountedEvent): void {
  let entity = new StepsCounted(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  );
  entity.user = event.params.user;
  entity.stepCount = event.params.stepCount;

  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;

  entity.save();
}

export function handleTransfer(event: TransferEvent): void {
  let entity = new Transfer(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  );
  entity.from = event.params.from;
  entity.to = event.params.to;
  entity.tokenId = event.params.tokenId;

  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;

  entity.save();
}

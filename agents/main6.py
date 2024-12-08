from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import Optional, List
import uvicorn
from fastapi.middleware.cors import CORSMiddleware
import os
import sys
import requests
import uuid
import time
from cdp import Wallet, hash_message
from langchain_core.messages import HumanMessage
from langchain_google_genai import ChatGoogleGenerativeAI
from langgraph.checkpoint.memory import MemorySaver
from langgraph.prebuilt import create_react_agent
from cdp_langchain.tools import CdpTool
from pydantic import BaseModel, Field
# Import CDP Agentkit Langchain Extension.
from cdp_langchain.agent_toolkits import CdpToolkit
from cdp_langchain.utils import CdpAgentkitWrapper
from cdp import Wallet, hash_message
from cdp_langchain.tools import CdpTool
from langchain import hub
from langchain.agents import AgentExecutor, create_tool_calling_agent
from langchain_core.tools import tool
from web3 import Web3
import google.generativeai as genai
import json
from cdp import *
# Keep all existing imports...

app = FastAPI(title="CDP Agent Server")
GOOGLE_API_KEY='AIzaSyCd7v59fLmQZVpsPTER-qNWZagJc_VUa9g'
genai.configure(api_key=GOOGLE_API_KEY)

Cdp.configure_from_json("cdp_api_key.json")
print("CDP SDK has been successfully configured from JSON file.")
file_path = "seed.json"
wallet=Wallet.fetch("63a1f400-ed60-496a-8e08-f0d88e7943fe")
wallet.load_seed(file_path)
print(wallet.default_address)
print("Wallet imported successfully")


# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Pydantic models for request/response
class ChatRequest(BaseModel):
    message: str

class ChatResponse(BaseModel):
    response: str
    blockchain_insights: Optional[dict] = None

# Global agent instance
agent_executor = None
config = None
@tool
def multiply(first_int: int, second_int: int) -> int:
    """Multiply two integers together."""
    return first_int * second_int
# Existing video info tool
@tool
def get_video_info(filepath: str) -> str:
    """Get video information from the video file of the path."""
    video_file_name = filepath
    video_file = genai.upload_file(path=video_file_name)
    while video_file.state.name == "PROCESSING":
        time.sleep(10)
        video_file = genai.get_file(video_file.name)
    if video_file.state.name == "FAILED":
        return("Video fail ")
    prompt = """Describe this video. and if the video contains some physical workout or similar stuff then approve 
         response ={
         "approved": true/false,
         }"""
    model = genai.GenerativeModel(model_name="models/gemini-1.5-flash", generation_config={"response_mime_type": "application/json"}, system_instruction="you are video parser agent which responds in true or false format")
    response = model.generate_content([prompt, video_file])
    return response

@tool 
def addSteps(steps: int, userAddress: str) -> str:
    """Update daily steps with wallet address given"""
    if(steps < 0 or steps == 0):
        return "Steps cannot be negative or zero"
    
    balance = wallet.balances()    
    with open('StepStakeDynamicNFT.json', 'r') as file:
        contract_data = json.load(file)
        abi = contract_data['abi']
        invocation = wallet.invoke_contract(
        contract_address="0x52dE6508FECCA4d712b75b0bD018a621EaF2d734",  # Replace with actual contract address
        abi=[{
        "inputs": [
            {"internalType": "address", "name": "wallet", "type": "address"},
            {"internalType": "uint256", "name": "stepCount", "type": "uint256"}
        ],
        "name": "updateDailySteps",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    }],
    method="updateDailySteps",
    args={
        "wallet":userAddress,  # Replace with the wallet address
        "stepCount": str(int(steps))  # Example step count, replace with actual steps
    })

    invocation.wait()
    print(invocation)
    return "Steps added to the goal"


@tool 
def dailyClaim(walletAddrs :str , imageUrl: str , challengeType :str ,description :str, quirkyMessage:str)-> str:
    """Mint daily challenge NFT with wallet address image URL as imageUrl and challenge type given as challengeType and description given as description and quirky message given as quirkyMessage"""
    invocation = wallet.invoke_contract(
    contract_address="0x52dE6508FECCA4d712b75b0bD018a621EaF2d734",  # Replace with actual contract address
    abi=[{
        "inputs": [
            {"internalType": "address", "name": "user", "type": "address"},
            {"internalType": "string", "name": "challengeType", "type": "string"},
            {"internalType": "string", "name": "description", "type": "string"},
            {"internalType": "string", "name": "quirkyMessage", "type": "string"},
            {"internalType": "string", "name": "imageUrl", "type": "string"}
        ],
        "name": "mintDailyChallengeNFT",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    }],
    method="mintDailyChallengeNFT",
    args={
        "user": walletAddrs,  # Replace with the user's wallet address
        "challengeType": challengeType,  # Example challenge type
        "description": description,  # Challenge description
        "quirkyMessage": quirkyMessage,  # Quirky message
        "imageUrl": imageUrl  # NFT image URL
    })
    invocation.wait()
    

    print(invocation)
    return "NFT minted successfully"

@tool
def claim(walletAddrs :str , imageUrl :str)-> str:
    """Claim mint NFT with wallet address and imageURL given"""
    address1 = wallet.default_address
    balance = wallet.balances()
    # Create a faucet request that returns a Faucet transaction, which can be used to retrieve the transaction hash.
    # Wait for the faucet transaction to land on-chain.
    balance = wallet.balances()
    print(balance)
    
    invocation = wallet.invoke_contract(
    contract_address="0x52dE6508FECCA4d712b75b0bD018a621EaF2d734",  # Replace with actual contract address
    abi=[{
        "inputs": [
            {"internalType": "address", "name": "wallet", "type": "address"},
            {"internalType": "string", "name": "imageUrl", "type": "string"}
        ],
        "name": "claimStakeAndMintNFT",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    }],
    method="claimStakeAndMintNFT",
    args={
        "wallet": walletAddrs,  # Replace with the wallet address
        "imageUrl": imageUrl  # Replace with actual image URL
    }
    )
    invocation.wait()
    print(invocation)
    return "NFT minted successfully"

toolsLG = [multiply, addSteps, get_video_info, claim, dailyClaim]
def initialize_agent():
    """Initialize the agent with CDP Agentkit."""
    
    file_path = "seed.json" 
    
    # Initialize LLM with Gemini
    llm = ChatGoogleGenerativeAI(model="gemini-1.5-flash", google_api_key="AIzaSyCd7v59fLmQZVpsPTER-qNWZagJc_VUa9g")

    wallet_data = None

    

    # Configure CDP Agentkit Langchain Extension.
    values = {}
    if wallet_data is not None:
        # If there is a persisted agentic wallet, load it and pass to the CDP Agentkit Wrapper.
        values = {"cdp_wallet_data": wallet_data}

    agentkit = CdpAgentkitWrapper(**values)
    
    # persist the agent's CDP MPC Wallet Data.
    wallet_data = agentkit.export_wallet()
    

    # Initialize CDP Agentkit Toolkit and get tools.
    cdp_toolkit = CdpToolkit.from_cdp_agentkit_wrapper(agentkit)
    tools = cdp_toolkit.get_tools()
    
    all_tools = cdp_toolkit.get_tools()+toolsLG 
    # Create custom blockchain tracker

    # Store buffered conversation history in memory.
    memory = MemorySaver()
    config = {"configurable": {"thread_id": "CDP Agentkit Chatbot Example!"}}

    # Create ReAct Agent using the LLM and CDP Agentkit tools.
    agent = create_react_agent(
        llm,
        tools=all_tools ,
        checkpointer=memory,
        state_modifier="You are a helpful agent that can interact onchain using the Coinbase Developer Platform Agentkit. You are empowered to interact onchain using your tools. If you ever need funds, you can request them from the faucet if you are on network ID `base-sepolia`. If not, you can provide your wallet details and request funds from the user. If someone asks you to do something you can't do with your currently available tools, you must say so, and encourage them to implement it themselves using the CDP SDK + Agentkit, recommend they go to docs.cdp.coinbase.com for more informaton. Be concise and helpful with your responses. Refrain from restating your tools' descriptions unless it is explicitly requested.",
    )


    return agent, config




    
@app.on_event("startup")
async def startup_event():
    """Initialize agent on server startup"""
    global agent_executor, config
    agent_executor, config = initialize_agent()



@app.post("/chat", response_model=ChatResponse)
async def chat_endpoint(request: ChatRequest):
    """Chat mode endpoint"""
    try:
        response_chunks = []
        blockchain_insights = None
        
        for chunk in agent_executor.stream(
            {"messages": [HumanMessage(content=request.message)]}, config
        ):
            if "agent" in chunk:
                response_chunks.append(chunk["agent"]["messages"][0].content)
            elif "tools" in chunk:
                response_chunks.append(chunk["tools"]["messages"][0].content)
            
            if hasattr(agent_executor, 'blockchain_tracker'):
                if any(keyword in request.message.lower() for keyword in ['transaction', 'wallet', 'address']):
                    blockchain_insights = agent_executor.blockchain_tracker.get_transaction_summary()

        return ChatResponse(
            response="\n".join(response_chunks),
            blockchain_insights=blockchain_insights
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/auto")
async def auto_endpoint():
    """Autonomous mode endpoint - triggers one autonomous action"""
    try:
        thought = (
            "Be creative and do something interesting on the blockchain. "
            "Choose an action or set of actions and execute it that highlights your abilities."
        )
        
        response_chunks = []
        for chunk in agent_executor.stream(
            {"messages": [HumanMessage(content=thought)]}, config
        ):
            if "agent" in chunk:
                response_chunks.append(chunk["agent"]["messages"][0].content)
            elif "tools" in chunk:
                response_chunks.append(chunk["tools"]["messages"][0].content)

        return {"response": "\n".join(response_chunks)}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {"status": "healthy"}

def start_server():
    """Start the FastAPI server"""
    uvicorn.run(app, host="0.0.0.0", port=8000)

if __name__ == "__main__":
    print("Starting CDP Agent Server...")
    start_server()

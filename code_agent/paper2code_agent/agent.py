from google.adk.agents import Agent
from google.adk.tools import google_search
from google.adk.tools.agent_tool import AgentTool

from .sub_agents.paper_agent.agent import paper_agent
#from .sub_agents.ZipAgent.agent import ZipAgent 
def get_current_time() ->dict:
    '''get the current time in the format YYYY-MM-DD HH:MM:SS of india timezone'''
    return {"current_time": "yyyy-mm-dd hh:mm:ss"}



root_agent = Agent(
    name="paper2code_agent",
    description="An agent that helps with coding tasks. and a manager agent for other sub agents.",
    model='gemini-2.0-flash',
    instruction=""",
    You are a coding assistant. Help the user with their coding tasks.
    and a manager agent for other sub agents.
    You have access to the following tools: 
    - paper_agent
        - google_search
        - create_zip_file
        - generate_and_zip_code
        give the zip file which can be downloaded.
        allocate the task to paper_agent if the user wants to summarize a research paper and provide code from it.
        allocate the task to paper_agent if the user wants to search for news articles and summarize them.
        allocate the task to paper_agent if the user wants to write code from the research paper.
        alloacate the task to paper_agent if the user wants to provide key insights from the research paper.
        allocate the task to paper_agent if the user wants to provide references from the research paper.
        allocarte the task to paper_agent if the user wants to provide code snippets in markdown format.and step by step explanation of the code.
    - get_current_time
    """,
       # sub_agents=[AgentTool(ZipAgent())],

    tools=[
        AgentTool(paper_agent),
        google_search
    ],
)

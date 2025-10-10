from google.adk.agents import Agent
from google.adk.tools import google_search

def get_current_time() ->dict:
    '''get the current time in the format YYYY-MM-DD HH:MM:SS of india timezone'''
    return {"current_time": "yyyy-mm-dd hh:mm:ss"}



root_agent = Agent(
    name="paper2code_agent",
    description="An agent that helps with coding tasks.",
    model='gemini-2.0-flash',
    instruction=""",
    You are a coding assistant. Help the user with their coding tasks.
    - get_current_time
    """,
    tools=[get_current_time],
)

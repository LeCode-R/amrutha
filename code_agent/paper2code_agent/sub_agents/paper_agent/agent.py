from google.adk.agents import Agent
from google.adk.tools import google_search

def get_current_time() ->dict:
    '''get the current time in the format YYYY-MM-DD HH:MM:SS of india timezone'''
    return {"current_time": "yyyy-mm-dd hh:mm:ss"}


root_agent = Agent(
    name="paper_agent",
    description="An agent that helps with paper tasks.",
    model='gemini-2.0-flash',
    instruction=""",
  You are a paper assistant. Help the user with their paper tasks. and analyze and summarize research papers.
  
    - get_current_time
    """,
    tools=[google_search],
)

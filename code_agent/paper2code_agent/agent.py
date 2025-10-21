import io
import zipfile
from google.adk.agents import Agent
from google.adk.tools import google_search
from google.adk.tools.agent_tool import AgentTool

#from .sub_agents.paper_agent.agent import paper_agent

def get_current_time() -> dict:
    '''Get the current time in the format YYYY-MM-DD HH:MM:SS of India timezone'''
    return {"current_time": "yyyy-mm-dd hh:mm:ss"}


class ZipTool:
    def __init__(self):
        self.name = "zip_file_creator"
        self.description = "Tool to create ZIP files from supplied code files."

    def create_zip(self, files: dict) -> bytes:
        """
        Create a ZIP file from a dictionary of filenames to file contents.
        Returns bytes of the ZIP archive.
        """
        buffer = io.BytesIO()
        with zipfile.ZipFile(buffer, 'w') as zip_file:
            for filename, content in files.items():
                zip_file.writestr(filename, content)
        buffer.seek(0)
        return buffer.read()

    def __call__(self, *args, **kwargs):
        files = kwargs.get("files", {})
        zipped_bytes = self.create_zip(files)
        return zipped_bytes


zip_tool_agent = AgentTool(ZipTool())

root_agent = Agent(
    name="paper2code_agent",
    description="An agent that helps with coding tasks and manages sub agents.",
    model='gemini-2.0-flash',
    instruction="""
    You are a coding assistant and a manager agent for sub agents.
    You have access to the following tools: 
    - paper_agent
      - google_search
      - create_zip_file
      - generate_and_zip_code
      Give the zip file which can be downloaded.
      Allocate tasks related to research paper summarization, code generation,
      and providing key insights to paper_agent.
      Provide code snippets in markdown format with explanations.
    - get_current_time
    - zip_tool_agent to create ZIP files from code files.
    """,
    tools=[
        #AgentTool(paper_agent),
        google_search,
        zip_tool_agent,  # Added ZIP file creation tool
    ],
)

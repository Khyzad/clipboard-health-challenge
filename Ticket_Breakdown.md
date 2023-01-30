# Ticket Breakdown
We are a staffing company whose primary purpose is to book Agents at Shifts posted by Facilities on our platform. We're working on a new feature which will generate reports for our client Facilities containing info on how many hours each Agent worked in a given quarter by summing up every Shift they worked. Currently, this is how the process works:

- Data is saved in the database in the Facilities, Agents, and Shifts tables
- A function `getShiftsByFacility` is called with the Facility's id, returning all Shifts worked that quarter, including some metadata about the Agent assigned to each
- A function `generateReport` is then called with the list of Shifts. It converts them into a PDF which can be submitted by the Facility for compliance.

## You've been asked to work on a ticket. It reads:

**Currently, the id of each Agent on the reports we generate is their internal database id. We'd like to add the ability for Facilities to save their own custom ids for each Agent they work with and use that id when generating reports for them.**


Based on the information given, break this ticket down into 2-5 individual tickets to perform. Provide as much detail for each ticket as you can, including acceptance criteria, time/effort estimates, and implementation details. Feel free to make informed guesses about any unknown details - you can't guess "wrong".


You will be graded on the level of detail in each ticket, the clarity of the execution plan within and between tickets, and the intelligibility of your language. You don't need to be a native English speaker, but please proof-read your work.

## Your Breakdown Here
I'm going to make the assumption that all these tables and functions already exist and currently have tests surrounding them. Given the description, I'm going to make the general assumption that the tables are relational and look like this (all primary keys don't have to be ints, they could be guids if you need them to be slightly obscure):

Facilities:
  *primary key int* id 
  *varchar* name

Agents:
  *primary key int* id
  *varchar* name  
  
Shifts:
  *primary key int* id
  *foreign key* agentId 
  *foreign key* facilityId  
  *datetime* start
  *datetime* end

I will also make the assumption that there is some way, either via gui or api, to allow agents or facilities to log shifts. For simplicity, I will assume that it will eventually resolve into a function call called 'logShift(agentId: number | guid, facilityId, number | guid)'


1. Add a new table to hold the relationship between a facilities' preferred custom id and an agent
  The ask is to allow facilities to save their own custom id's and use that to reference their agent. The new table should look like the following:

  CustomizedAgentsIds (Name pending)
  *varchar nullable index* id
  *foreign key* facilityId  
  *foreign key* agentId   

  The addition of the new table will not affect existing records and incur minimal downtime in production. The new table will sets up the logic for ticket 2

2. Update generateReports to join on CustomizedAgentsIds
  The current logic of generateReports is called with a list of shifts to report an agents activities. With the addition of the new table, we should now be able to update the function to join Shifts and CustomizedAgentsIds and, if there are matches, overwrite the id provided by shifts in preference with the custom id provided by the newly created table

3. Update api to allow either agents or facilities to add their own custom id's
  Either the existing api will need to be updated or a new api will need to be exposed to add new records to the CustomizedAgentsIds so that there can be data for generateReports to join off of

4. Integration Testing
  Assuming that the aforementioned tickets are merged with accompanying unit tests, a integration test is needed to ensure that all relevant api's are working as intended. Some cases to consider are the following:
  - ensuring that different facilities are able to have the same custom id associated with either the same or different agents
  - ensuring that the customId is correctly replacing the internal id if they exist, otherwise default to the internal id
  - ensuring that the the custom id's can be changed, or deleted, at any time at the request of either the agent or facility
  - the resulting pdf contains no mention of the internal id if there is a custom id
  - all other regression tests pass
  
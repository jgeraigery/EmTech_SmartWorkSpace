import logging
import azure.functions as func
import json
    
import azure.cosmos.documents as documents
import azure.cosmos.cosmos_client as cosmos_client
import azure.cosmos.errors as errors
import azure.cosmos.partition_key as PartitionKey
import azure.cosmos.documents as documents
import azure.cosmos.http_constants as http_constants

database_name = "UserTimeSpentInfo"

HOST = "https://group16.documents.azure.com:443/"
MASTER_KEY = "8bBzMrmOPLBPHLnXCETG41MsgCR1dT2SuXsHe0uZ23Qi2F3vqDPhADrxsLs17IT7RtRumaGCZPmPm9Ijr74z9g=="

class IDisposable:
    """ A context manager to automatically close an object with a close method
    in a with statement. """

    def __init__(self, obj):
        self.obj = obj

    def __enter__(self):
        return self.obj # bound to target

    def __exit__(self, exception_type, exception_val, trace):
        # extra cleanup in here
        self.obj = None


####################Simplified funtions for manipulating cosmos database####################

def Cosmos_ReadItems(client, databaseID, ContainerID):
    return client.ReadItems("dbs/" + databaseID + "/colls/" + ContainerID)


def Cosmos_AddItem(client, databaseID, ContainerID, item):
    client.UpsertItem("dbs/" + databaseID + "/colls/" + ContainerID, item)

def Cosmos_CreateContainer(client, databaseID, containerDef, offerThroughput):
    try:
        container = client.CreateContainer("dbs/" + databaseID, containerDef, {'offerThroughput': offerThroughput})
        return container
    except errors.HTTPFailure as e:
            if e.status_code == http_constants.StatusCodes.CONFLICT:
                container = client.ReadContainer("dbs/" + databaseID + "/colls/" + containerDef["id"])
                return container
            else:
                raise e

def Cosmos_CreateDatabase(client, databaseID):
    try:
        database = client.CreateDatabase({'id': databaseID})
    except errors.HTTPFailure:
        database = client.ReadDatabase("dbs/" + databaseID)
    return database
####################END


def storeInDB(timeTrackingInfo):
    with IDisposable(cosmos_client.CosmosClient(HOST, {'masterKey': MASTER_KEY} )) as client:
        userID = timeTrackingInfo.get('userID')
        del timeTrackingInfo['userID']
        #Create 
        database = Cosmos_CreateDatabase(client, database_name)
        # Create a container
        # Using a good partition key improves the performance of database operations.
        # <create_container_if_not_exists>
        # Use userID as the container name(Each containrer represent one user)
        container_definition = {'id': userID,
                                'partitionKey':
                                            {
                                                'paths': ['/User'],
                                                'kind': documents.PartitionKind.Hash
                                            }
                                }

        container = Cosmos_CreateContainer(client, database_name, container_definition, 400)

        #Add a single time tracking record of particular user
        Cosmos_AddItem(client, database_name, userID, timeTrackingInfo)


def retrieveUserData(userID):
    with IDisposable(cosmos_client.CosmosClient(HOST, {'masterKey': MASTER_KEY} )) as client:

        #Convert the interable object to a list and parse to JSON string
        userTimeSpentInfoList = list(Cosmos_ReadItems(client, database_name, userID))

        headers = {"Access-Control-Allow-Origin": "*"}

        return func.HttpResponse(
                json.dumps(userTimeSpentInfoList),
                status_code=200,
                headers=headers
        )

def retrieveGeoData():
    with IDisposable(cosmos_client.CosmosClient(HOST, {'masterKey': MASTER_KEY} )) as client:

        geoData = (list(Cosmos_ReadItems(client, "CloudData", "geoJSONFeature")))[0]

        return geoData



def main(req: func.HttpRequest) -> func.HttpResponse:

    #Define the allow origin headers.
    headers = {"Access-Control-Allow-Origin": "*"}

    try: 
        # Get userID from url, this is for generating time spending report for users
        userID = req.params.get("userID")
        if userID is not None:
            return retrieveUserData(userID)

        if (req.get_body().decode('ASCII')) is "f":
           return func.HttpResponse(
                json.dumps(retrieveGeoData()),
                status_code=200,
                headers=headers
            )

        # Get request data in json format.
        reqJson = req.get_json()

        #Store the latest time tracking info in Cosmos db 
        storeInDB(reqJson)

        return func.HttpResponse(
                json.dumps({
                    "userID" : json.dumps(reqJson.get('userID')),
                    "date" : json.dumps(reqJson.get('date')),
                    "userName" : json.dumps(reqJson.get('userName')),
                    "timeSpentInfo" : json.dumps(reqJson.get('timeSpentInfo')),
                }),
                status_code=200,
                headers=headers
            )
    except:
        return func.HttpResponse(
                "No data passed/Data not in Json format",
                status_code=400,
                headers=headers
        )
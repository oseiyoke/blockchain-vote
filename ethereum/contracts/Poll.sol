pragma solidity ^0.4.17;

contract PollFactory{
    address[] public deployedPolls;    
    
    function createPoll(bytes32 _title, uint _start_time, uint _end_time) public {
        address newPoll = new Poll(_title, _start_time, _end_time);
        deployedPolls.push(newPoll);
    }

    function getDeployedPolls() public view returns(address[]) {
        return deployedPolls;
    }

    function getDeployedPollsLength() public view returns(uint) {
        return deployedPolls.length;
    }    
}




contract Poll{
    // an event that is called whenever a Candidate is added so the frontend could
    // appropriately display the candidate with the right element id (it is used
    // to vote for the candidate, since it is one of arguments for the function "vote")
    event AddedCandidate(uint candidateID);

    // describes a Voter, which has an id and the ID of the candidate they voted for
    struct Voter {
        bytes32 uid; // bytes32 type are basically strings
        uint candidateIDVote;
    }
    // describes a Candidate
    struct Candidate {
        bytes32 name;
        bytes32 party; 
        // "bool doesExist" is to check if this Struct exists
        // This is so we can keep track of the candidates 
        bool doesExist; 
    }

    // These state variables are used keep track of the number of Candidates/Voters 
    // and used to as a way to index them     
    uint numCandidates; // declares a state variable - number Of Candidates
    uint numVoters;
    uint start_time;
    uint end_time;
    
    //Title of the Poll
    bytes32 public title;
    
    // Think of these as a hash table, with the key as a uint and value of 
    // the struct Candidate/Voter. These mappings will be used in the majority
    // of our transactions/calls
    // These mappings will hold all the candidates and Voters respectively
    mapping (uint => Candidate) candidates;
    mapping (uint => Voter) voters;
    

    // modifiers or as I like to call them "decorators"
    modifier validTime(uint _start_time, uint _end_time){
        require(_start_time > now && _end_time > now && _end_time > _start_time);
        _;
    }

    function Poll(bytes32 _title, uint _start_time, uint _end_time) validTime(_start_time,_end_time) public {
        title = _title;
        start_time = _start_time;
        end_time = _end_time;
    }
    /* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
     *  These functions perform transactions, editing the mappings *
     * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

    function addCandidate(bytes32 name, bytes32 party) public {
        // candidateID is the return variable
        uint candidateID = numCandidates++;
        // Create new Candidate Struct with name and saves it to storage.
        candidates[candidateID] = Candidate(name,party,true);
        AddedCandidate(candidateID);
    }

    function vote(bytes32 uid, uint candidateID) public {
        // checks if the struct exists for that candidate
        if (candidates[candidateID].doesExist == true) {
            uint voterID = numVoters++; //voterID is the return variable
            voters[voterID] = Voter(uid,candidateID);
        }
    }

    /* * * * * * * * * * * * * * * * * * * * * * * * * * 
     *  Getter Functions, marked by the key word "view" *
     * * * * * * * * * * * * * * * * * * * * * * * * * */
    

    // finds the total amount of votes for a specific candidate by looping
    // through voters 
    function totalVotes(uint candidateID) view public returns (uint) {
        uint numOfVotes = 0; // we will return this
        for (uint i = 0; i < numVoters; i++) {
            // if the voter votes for this specific candidate, we increment the number
            if (voters[i].candidateIDVote == candidateID) {
                numOfVotes++;
            }
        }
        return numOfVotes; 
    }

    function getNumOfCandidates() public view returns(uint) {
        return numCandidates;
    }

    function getNumOfVoters() public view returns(uint) {
        return numVoters;
    }
    // returns candidate information, including its ID, name, and party
    function getCandidate(uint candidateID) public view returns (uint,bytes32, bytes32) {
        return (candidateID,candidates[candidateID].name,candidates[candidateID].party);
    }
}
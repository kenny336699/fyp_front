//SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

contract Crowdfunding {
    address public owner;
    uint public projectTax;
    uint public projectCount;
    uint public balance;
    statsStruct public stats;
    projectStruct[] projects;

    mapping(address => projectStruct[]) projectsOf;
    mapping(uint => backerStruct[]) backersOf;
    mapping(uint => bool) public projectExist;

    enum statusEnum {
        OPEN,
        APPROVED,
        REVERTED,
        DELETED,
        PAIDOUT
    }

    struct statsStruct {
        uint totalProjects;
        uint totalBacking;
        uint totalDonations;
    }

    struct backerStruct {
        address owner;
        string email;
        uint contribution;
        uint timestamp;
        bool refunded;
    }

    struct projectStruct {
        uint id;
        address owner;
        string title;
        string description;

        uint cost;
        uint raised;
        uint timestamp;
        uint expiresAt;
        uint backers;
        statusEnum status;
    }
    struct ProjectWithBackers {
        projectStruct project;
        backerStruct[] backers;
    }
     struct DeleteProjectResult {
        bool success;
        address[] donors;
    }
    modifier ownerOnly(){
        require(msg.sender == owner, "Owner reserved only");
        _;
    }

    event Action (
        uint256 id,
        string actionType,
        address indexed executor,
        uint256 timestamp
    );

    constructor(uint _projectTax) {
        owner = msg.sender;
        projectTax = _projectTax;
    }

    function createProject(
        string memory title,
        string memory description,
        uint cost,
        uint expiresAt
    ) public returns (bool) {
        require(bytes(title).length > 0, "Title cannot be empty");
        require(bytes(description).length > 0, "Description cannot be empty");

        require(cost > 0 ether, "Cost cannot be zero");

        projectStruct memory project;
        project.id = projectCount;
        project.owner = msg.sender;
        project.title = title;
        project.description = description;
        project.cost = cost;
        project.timestamp = block.timestamp;
        project.expiresAt = expiresAt;

        projects.push(project);
        projectExist[projectCount] = true;
        projectsOf[msg.sender].push(project);
        stats.totalProjects += 1;

        emit Action (
            projectCount++,
            "PROJECT CREATED",
            msg.sender,
            block.timestamp
        );
        return true;
    }

    function updateProject(
        uint id,
        string memory title,
        string memory description,
   
        uint expiresAt
    ) public returns (bool) {
        require(msg.sender == projects[id].owner, "Unauthorized Entity");
        require(bytes(title).length > 0, "Title cannot be empty");
        require(bytes(description).length > 0, "Description cannot be empty");
     

        projects[id].title = title;
        projects[id].description = description;
        projects[id].expiresAt = expiresAt;

        emit Action (
            id,
            "PROJECT UPDATED",
            msg.sender,
            block.timestamp
        );

        return true;
    }

    function deleteProject(uint id) public returns (DeleteProjectResult memory) {
        require(projects[id].status == statusEnum.OPEN, "Project no longer opened");
        require(msg.sender == projects[id].owner, "Unauthorized Entity");
        address[] memory donors = new address[](backersOf[id].length);
        for (uint i = 0; i < backersOf[id].length; i++) {
            donors[i] = backersOf[id][i].owner;
        }
        projects[id].status = statusEnum.DELETED;
        performRefund(id);

        emit Action (
            id,
            "PROJECT DELETED",
            msg.sender,
            block.timestamp
        );

       return DeleteProjectResult(true, donors);
    }

    function performRefund(uint id) internal {
        for(uint i = 0; i < backersOf[id].length; i++) {
            address _owner = backersOf[id][i].owner;
            uint _contribution = backersOf[id][i].contribution;
            
            backersOf[id][i].refunded = true;
            backersOf[id][i].timestamp = block.timestamp;
            payTo(_owner, _contribution);

            stats.totalBacking -= 1;
            stats.totalDonations -= _contribution;
        }
    }

    function backProject(uint id,string memory email) public payable returns (bool) {
        require(msg.value > 0 ether, "Ether must be greater than zero");
        require(projectExist[id], "Project not found");
        require(projects[id].status == statusEnum.OPEN, "Project no longer opened");

        stats.totalBacking += 1;
        stats.totalDonations += msg.value;
        projects[id].raised += msg.value;
        projects[id].backers += 1;

        backersOf[id].push(
            backerStruct(
                msg.sender,
                email,
                msg.value,
                block.timestamp,
                false
            )
        );

        emit Action (
            id,
            "PROJECT BACKED",
            msg.sender,
            block.timestamp
        );

        // if(projects[id].raised >= projects[id].cost) {
        //     projects[id].status = statusEnum.APPROVED;
        //     balance += projects[id].raised;
        //     performPayout(id);
        //     return true;
        // }

        // if(block.timestamp >= projects[id].expiresAt) {
        //     projects[id].status = statusEnum.REVERTED;
        //     performRefund(id);
        //     return true;
        // }

        return true;
    }

    function performPayout(uint id) internal {
        
        uint raised = projects[id].raised;
        uint tax = (raised * projectTax) / 100;

        projects[id].status = statusEnum.PAIDOUT;

        payTo(projects[id].owner, (raised - tax));
        payTo(owner, tax);

        balance -= projects[id].raised;

        emit Action (
            id,
            "PROJECT PAID OUT",
            msg.sender,
            block.timestamp
        );
    }

    function requestRefund(uint id) public returns (bool) {
        require(
            projects[id].status != statusEnum.REVERTED ||
            projects[id].status != statusEnum.DELETED,
            "Project not marked as revert or delete"
        );
        
        projects[id].status = statusEnum.REVERTED;
        performRefund(id);
        return true;
    }

    function payOutProject(uint id) public returns (bool) {
        require(projects[id].status == statusEnum.APPROVED, "Project not APPROVED");
        require(
            msg.sender == projects[id].owner ||
            msg.sender == owner,
            "Unauthorized Entity"
        );

        performPayout(id);
        return true;
    }

    function changeTax(uint _taxPct) public ownerOnly {
        projectTax = _taxPct;
    }

    function getProject(uint id) public view returns (projectStruct memory) {
        require(projectExist[id], "Project not found");

        return projects[id];
    }
    
    function getProjects() public view returns (projectStruct[] memory) {
        return projects;
    }
    
    function getBackers(uint id) public view returns (backerStruct[] memory) {
        return backersOf[id];
    }

    function payTo(address to, uint256 amount) internal {
        (bool success, ) = payable(to).call{value: amount}("");
        require(success);
    }

   function refundExpiredProjects() public returns (uint[] memory, uint[] memory) {
    uint[] memory refundedProjectIds = new uint[](projects.length);
    uint[] memory refundedBackersCounts = new uint[](projects.length);
    uint count = 0; // Number of refunded projects

    for (uint i = 0; i < projects.length; i++) {
        if (isProjectExpiredAndOpen(projects[i])) {
            projects[i].status = statusEnum.REVERTED;
            performRefund(projects[i].id);

            // Store refunded project ID and the number of refunded backers
            refundedProjectIds[count] = projects[i].id;
            refundedBackersCounts[count] = backersOf[projects[i].id].length;
            count++; // Increment counter
        }
    }

    // Trim the arrays to remove unused slots
    refundedProjectIds = trimArray(refundedProjectIds, count);
    refundedBackersCounts = trimArray(refundedBackersCounts, count);

    return (refundedProjectIds, refundedBackersCounts);
}

function isProjectExpiredAndOpen(projectStruct memory project) internal view returns (bool) {
    return (
        block.timestamp >= project.expiresAt &&
        project.status == statusEnum.OPEN
    );
}

function trimArray(uint[] memory array, uint newSize) internal pure returns (uint[] memory) {
    uint[] memory trimmedArray = new uint[](newSize);
    for (uint i = 0; i < newSize; i++) {
        trimmedArray[i] = array[i];
    }
    return trimmedArray;
}

}
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract HealthRecords {

    struct Record {
        uint256 recordId;
        string  patientId;
        string  hospitalName;
        string  doctorName;
        string  diagnosis;
        string  medicines;
        string  testResults;
        string  notes;
        uint256 visitDate;
    }

    address public governmentAdmin;
    uint256 public totalRecords;

    mapping(string => Record[]) private patientRecords;
    mapping(address => bool) public authorizedHospitals;
    mapping(address => string) public hospitalNames;

    event RecordAdded(string patientId, string hospitalName);
    event HospitalAuthorized(address hospital, string name);

    constructor() { governmentAdmin = msg.sender; }

    function authorizeHospital(address _addr, string memory _name) public {
        require(msg.sender == governmentAdmin, 'Admin only');
        authorizedHospitals[_addr] = true;
        hospitalNames[_addr] = _name;
        emit HospitalAuthorized(_addr, _name);
    }

    function addRecord(
        string memory _patientId,
        string memory _doctorName,
        string memory _diagnosis,
        string memory _medicines,
        string memory _testResults,
        string memory _notes
    ) public {
        require(authorizedHospitals[msg.sender], 'Not authorized');
        totalRecords++;
        patientRecords[_patientId].push(Record({
            recordId:     totalRecords,
            patientId:    _patientId,
            hospitalName: hospitalNames[msg.sender],
            doctorName:   _doctorName,
            diagnosis:    _diagnosis,
            medicines:    _medicines,
            testResults:  _testResults,
            notes:        _notes,
            visitDate:    block.timestamp
        }));
        emit RecordAdded(_patientId, hospitalNames[msg.sender]);
    }

    // NO require here - anyone can read records
    function getPatientRecords(string memory _patientId)
        public view returns (Record[] memory)
    {
        return patientRecords[_patientId];
    }
}

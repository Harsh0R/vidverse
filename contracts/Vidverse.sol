// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract MyToken is ERC20 {
    constructor() ERC20("VidToken", "NVT") {
        _mint(msg.sender, 10000000 * 10 **18);
    }
}

contract VideoPlatform {
    struct Video {
        uint256 id;
        address owner;
        string title;
        string description;
        string ipfsHash;
        uint256 tipAmount;
    }

    Video[] public videos;
    ERC20 public myToken;

    event VideoUploaded(
        uint256 id,
        address owner,
        string title,
        string description,
        string ipfsHash
    );

    constructor() {
        MyToken token = new MyToken();
        myToken = token;
    }

    function uploadVideo(
        string memory _title,
        string memory _description,
        string memory _ipfsHash
    ) public {
        // Check if the IPFS hash already exists
        for (uint256 i = 0; i < videos.length; i++) {
            require(
                keccak256(abi.encodePacked(videos[i].ipfsHash)) !=
                    keccak256(abi.encodePacked(_ipfsHash)),
                "Video with the same IPFS hash already exists"
            );
        }

        uint256 id = videos.length;
        videos.push(Video(id, msg.sender, _title, _description, _ipfsHash, 0));
        myToken.transfer(msg.sender, 1000);
        emit VideoUploaded(id, msg.sender, _title, _description, _ipfsHash);
    }

    function tipVideoOwner(uint256 _videoId, uint256 _amount) public payable {
        require(_videoId < videos.length, "Invalid video ID");
        require(_amount > 0, "Amount must be greater than 0");

        Video storage video = videos[_videoId];
        require(video.owner != address(0), "Video not found");
        require(
            myToken.allowance(msg.sender, address(this)) >= _amount,
            "Insufficient allowance"
        );
        require(
            myToken.transferFrom(msg.sender, address(this), _amount),
            "Fail to transfer token in address"
        );
        require(
            myToken.transfer(video.owner, _amount),
            "Fail to transfer token to videos owner"
        );

        // Update tip amount
        video.tipAmount += _amount;
    }

    function getAllVideos() public view returns (Video[] memory) {
        return videos;
    }

    function getBalance(address addr) external view returns (uint256) {
        return myToken.balanceOf(addr);
    }
}

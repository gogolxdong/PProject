pragma solidity ^0.8.0;
import "./ImageLibrary.sol";

abstract contract Context {
    function _msgSender() internal view virtual returns (address) {
        return msg.sender;
    }

    function _msgData() internal view virtual returns (bytes calldata) {
        return msg.data;
    }
}

abstract contract Ownable is Context {
    address private _owner;

    event OwnershipTransferred(address indexed previousOwner, address indexed newOwner);

    /**
     * @dev Initializes the contract setting the deployer as the initial owner.
     */
    constructor() {
        _transferOwnership(_msgSender());
    }

    /**
     * @dev Returns the address of the current owner.
     */
    function owner() public view virtual returns (address) {
        return _owner;
    }

    /**
     * @dev Throws if called by any account other than the owner.
     */
    modifier onlyOwner() {
        require(owner() == _msgSender(), "Ownable: caller is not the owner");
        _;
    }

    /**
     * @dev Leaves the contract without owner. It will not be possible to call
     * `onlyOwner` functions anymore. Can only be called by the current owner.
     *
     * NOTE: Renouncing ownership will leave the contract without an owner,
     * thereby removing any functionality that is only available to the owner.
     */
    function renounceOwnership() public virtual onlyOwner {
        _transferOwnership(address(0));
    }

    /**
     * @dev Transfers ownership of the contract to a new account (`newOwner`).
     * Can only be called by the current owner.
     */
    function transferOwnership(address newOwner) public virtual onlyOwner {
        require(newOwner != address(0), "Ownable: new owner is the zero address");
        _transferOwnership(newOwner);
    }

    /**
     * @dev Transfers ownership of the contract to a new account (`newOwner`).
     * Internal function without access restriction.
     */
    function _transferOwnership(address newOwner) internal virtual {
        address oldOwner = _owner;
        _owner = newOwner;
        emit OwnershipTransferred(oldOwner, newOwner);
    }
}

contract Decentiktok is Ownable {
    string public name;
    uint256 public imageCount = 0;
    mapping(uint256 => ImageLibrary.Image) private _images;
    mapping(address => mapping(uint256 => uint256)) private _tipped;
    event ImageCreated(
        uint256 id,
        string hash,
        string description,
        string longitude,
        string latitude,
        string gender,
        uint256 stakeAmount,
        uint256 stakeTime,
        uint256 tipAmount,
        address payable author
    );

    event ImageTipped(
        uint256 id,
        string hash,
        string description,
        string longitude,
        string latitude,
        string gender,
        uint256 stakeAmount,
        uint256 stakeTime,
        uint256 tipAmount,
        address payable author
    );

    constructor() {
        name = "Decentiktok";
    }

    function getImage(uint256 _id)
        public
        view
        returns (ImageLibrary.Image memory)
    {
        ImageLibrary.Image memory _image = _images[_id];
        if (_tipped[msg.sender][_id] == 0) {
            _image.description = "";
            return _image;
        } else {
            return _image;
        }
    }

    function removeImage(uint256 _id) public onlyOwner {
        delete _images[_id];
    }

    function tipped(address user, uint256 _id) public view returns(uint256) {
        return _tipped[user][_id];
    }

    function uploadImage(
        string memory _imgHash,
        string memory _description,
        string memory _longitude,
        string memory _latitude,
        string memory _gender,
        uint256 _stakeAmount,
        uint256 _stakeTime
    ) public {
        require(bytes(_imgHash).length > 0, "iamge hash is empty");
        require(bytes(_description).length > 0, "description is empty");
        require(bytes(_longitude).length > 0, "longitude is empty");
        require(bytes(_latitude).length > 0, "latitude is empty");
        require(_stakeAmount != 0, "stake amount cannot be 0");
        require(_stakeTime != 0, "stake time cannot be 0");
        require(msg.sender != address(0));

        imageCount++;

        _images[imageCount] = ImageLibrary.Image(
            imageCount,
            _imgHash,
            "",
            _description,
            _longitude,
            _latitude,
            _gender,
            _stakeAmount,
            _stakeTime,
            0,
            payable(msg.sender)
        );
        emit ImageCreated(
            imageCount,
            _imgHash,
            _description,
            _longitude,
            _latitude,
            _gender,
            _stakeAmount,
            _stakeTime,
            0,
            payable(msg.sender)
        );
    }

    function tipImageOwner(uint256 _id) public payable {
        require(_id > 0 && _id <= imageCount);
        ImageLibrary.Image memory _image = _images[_id];
        address payable _author = _image.author;
        payable(_author).transfer(msg.value);
        _image.tipAmount = _image.tipAmount + msg.value;
        _images[_id] = _image;
        _tipped[msg.sender][_id] += msg.value;
        emit ImageTipped(
            _id,
            _image.hash,
            _image.description,
            _image.longitude,
            _image.latitude,
            _image.gender,
            _image.stakeAmount,
            _image.stakeTime,
            _image.tipAmount,
            _author
        );
    }
}

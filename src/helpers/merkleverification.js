const { MerkleTree } = require('merkletreejs');
const keccak256 = require('keccak256');

const allowlistWalconsts = ['0x0000000000000000000000000000000000000000','0xc2543fe877e3cef40ae489d247dc605ffac4399b','0xf5e0919db6dd3abcb4a942c6144cc005f02e5fd5','0xf7f5090cf84771be616d738fefc5092f33f87b74','0xf80fa7a3e60a0579739cb1adf74034025a1a1ed1','0xffd8d39d4425bc4bdf9a022eaf53019a5981a646'];

const leaves = allowlistWalconsts.map(x => keccak256(x.toLowerCase()));
const merkleTree = new MerkleTree(leaves, keccak256, {sortPairs: true});
const rootHash = merkleTree.getHexRoot().toString('hex');
const leaf = keccak256('0xc2543Fe877e3ceF40ae489d247dc605fFac4399B'.toLowerCase());
const proof = merkleTree.getHexProof(leaf);

console.log('Sorted Root',rootHash);
console.log('Sorted Merkle Verification', merkleTree.verify(proof, leaf, rootHash));
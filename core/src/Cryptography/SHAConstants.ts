import { New, UIntArray } from "../float";
import { bigInt, BigNumber } from "../Math/BigNumber";

export class SHAConstants {
    // SHA-256 Constants
    // Represent the first 32 bits of the fractional parts of the
    // cube roots of the first sixty-four prime numbers
    public static readonly K1: UIntArray = New.UIntArray([
        0x428A2F98, 0x71374491, 0xB5C0FBCF, 0xE9B5DBA5,
        0x3956C25B, 0x59F111F1, 0x923F82A4, 0xAB1C5ED5,
        0xD807AA98, 0x12835B01, 0x243185BE, 0x550C7DC3,
        0x72BE5D74, 0x80DEB1FE, 0x9BDC06A7, 0xC19BF174,
        0xE49B69C1, 0xEFBE4786, 0x0FC19DC6, 0x240CA1CC,
        0x2DE92C6F, 0x4A7484AA, 0x5CB0A9DC, 0x76F988DA,
        0x983E5152, 0xA831C66D, 0xB00327C8, 0xBF597FC7,
        0xC6E00BF3, 0xD5A79147, 0x06CA6351, 0x14292967,
        0x27B70A85, 0x2E1B2138, 0x4D2C6DFC, 0x53380D13,
        0x650A7354, 0x766A0ABB, 0x81C2C92E, 0x92722C85,
        0xA2BFE8A1, 0xA81A664B, 0xC24B8B70, 0xC76C51A3,
        0xD192E819, 0xD6990624, 0xF40E3585, 0x106AA070,
        0x19A4C116, 0x1E376C08, 0x2748774C, 0x34B0BCB5,
        0x391C0CB3, 0x4ED8AA4A, 0x5B9CCA4F, 0x682E6FF3,
        0x748F82EE, 0x78A5636F, 0x84C87814, 0x8CC70208,
        0x90BEFFFA, 0xA4506CEB, 0xBEF9A3F7, 0xC67178F2
    ]);

    // SHA-384 and SHA-512 Constants
    // Represent the first 64 bits of the fractional parts of the
    // cube roots of the first sixty-four prime numbers
    public static readonly K2: BigNumber[] = [
        bigInt('428a2f98d728ae22', 16), bigInt('7137449123ef65cd', 16), bigInt('b5c0fbcfec4d3b2f', 16), bigInt('e9b5dba58189dbbc', 16),
        bigInt('3956c25bf348b538', 16), bigInt('59f111f1b605d019', 16), bigInt('923f82a4af194f9b', 16), bigInt('ab1c5ed5da6d8118', 16),
        bigInt('d807aa98a3030242', 16), bigInt('12835b0145706fbe', 16), bigInt('243185be4ee4b28c', 16), bigInt('550c7dc3d5ffb4e2', 16),
        bigInt('72be5d74f27b896f', 16), bigInt('80deb1fe3b1696b1', 16), bigInt('9bdc06a725c71235', 16), bigInt('c19bf174cf692694', 16),
        bigInt('e49b69c19ef14ad2', 16), bigInt('efbe4786384f25e3', 16), bigInt('0fc19dc68b8cd5b5', 16), bigInt('240ca1cc77ac9c65', 16),
        bigInt('2de92c6f592b0275', 16), bigInt('4a7484aa6ea6e483', 16), bigInt('5cb0a9dcbd41fbd4', 16), bigInt('76f988da831153b5', 16),
        bigInt('983e5152ee66dfab', 16), bigInt('a831c66d2db43210', 16), bigInt('b00327c898fb213f', 16), bigInt('bf597fc7beef0ee4', 16),
        bigInt('c6e00bf33da88fc2', 16), bigInt('d5a79147930aa725', 16), bigInt('06ca6351e003826f', 16), bigInt('142929670a0e6e70', 16),
        bigInt('27b70a8546d22ffc', 16), bigInt('2e1b21385c26c926', 16), bigInt('4d2c6dfc5ac42aed', 16), bigInt('53380d139d95b3df', 16),
        bigInt('650a73548baf63de', 16), bigInt('766a0abb3c77b2a8', 16), bigInt('81c2c92e47edaee6', 16), bigInt('92722c851482353b', 16),
        bigInt('a2bfe8a14cf10364', 16), bigInt('a81a664bbc423001', 16), bigInt('c24b8b70d0f89791', 16), bigInt('c76c51a30654be30', 16),
        bigInt('d192e819d6ef5218', 16), bigInt('d69906245565a910', 16), bigInt('f40e35855771202a', 16), bigInt('106aa07032bbd1b8', 16),
        bigInt('19a4c116b8d2d0c8', 16), bigInt('1e376c085141ab53', 16), bigInt('2748774cdf8eeb99', 16), bigInt('34b0bcb5e19b48a8', 16),
        bigInt('391c0cb3c5c95a63', 16), bigInt('4ed8aa4ae3418acb', 16), bigInt('5b9cca4f7763e373', 16), bigInt('682e6ff3d6b2b8a3', 16),
        bigInt('748f82ee5defb2fc', 16), bigInt('78a5636f43172f60', 16), bigInt('84c87814a1f0ab72', 16), bigInt('8cc702081a6439ec', 16),
        bigInt('90befffa23631e28', 16), bigInt('a4506cebde82bde9', 16), bigInt('bef9a3f7b2c67915', 16), bigInt('c67178f2e372532b', 16),
        bigInt('ca273eceea26619c', 16), bigInt('d186b8c721c0c207', 16), bigInt('eada7dd6cde0eb1e', 16), bigInt('f57d4f7fee6ed178', 16),
        bigInt('06f067aa72176fba', 16), bigInt('0a637dc5a2c898a6', 16), bigInt('113f9804bef90dae', 16), bigInt('1b710b35131c471b', 16),
        bigInt('28db77f523047d84', 16), bigInt('32caab7b40c72493', 16), bigInt('3c9ebe0a15c9bebc', 16), bigInt('431d67c49c100d4c', 16),
        bigInt('4cc5d4becb3e42b6', 16), bigInt('597f299cfc657e2a', 16), bigInt('5fcb6fab3ad6faec', 16), bigInt('6c44198c4a475817', 16)
    ];
}

/*
export function isWhiteSpace(ch:number):boolean
{
	return ch===32 || (ch>=9 && ch<=13) || ch===133 || ch===160;
}
export function isLetter(ch:number):boolean
{
	return (65<=ch && ch<=90) || (97<=ch && ch<=122) || (ch>=128 && ch!==133 && ch!==160);
}
export function isLetterOrDigit(ch:number):boolean
{
	return (48<=ch && ch<=57) || (65<=ch && ch<=90) || (97<=ch && ch<=122) || (ch>=128 && ch!==133 && ch!==160);
}
export function isDigit(ch:number):boolean
export function isDigit(str:string, index:number):boolean
export function isDigit(chOrStr:any, index?:number):boolean
{
	if(arguments.length==1)
	{
		return 48<=chOrStr && chOrStr<=57;
	}
	else
	{
		const ch = chOrStr.charCodeAt(index);
		return 48<=ch && ch<=57;
	}
}
 */




const _GTYPE = {
    LETTER: [65, 32, 73, 11, 5, 6, 24, 32, 462, 26, 12, 2, 130, 6, 4, 12, 2, 4, 2, 21, 84, 147, 167, 40, 8, 111, 32, 48, 78, 3, 100, 16, 9, 12, 5, 17, 2, 59, 100, 25, 42, 6, 6, 26, 10, 4, 24, 196, 57, 19, 8, 25, 8, 12, 10, 4, 23, 8, 4, 7, 17, 14, 3, 17, 21, 10, 4, 23, 8, 3, 3, 33, 5, 20, 19, 10, 4, 23, 8, 3, 8, 19, 16, 37, 10, 4, 23, 8, 3, 8, 31, 3, 18, 18, 2, 9, 4, 7, 3, 2, 5, 5, 6, 34, 53, 9, 4, 24, 11, 8, 27, 8, 37, 9, 4, 24, 11, 8, 33, 2, 17, 20, 9, 4, 43, 17, 18, 26, 11, 21, 25, 10, 3, 65, 49, 14, 65, 3, 3, 3, 3, 7, 5, 8, 4, 2, 3, 3, 5, 11, 3, 6, 22, 36, 64, 9, 63, 120, 63, 17, 10, 7, 4, 9, 7, 25, 18, 48, 44, 4, 330, 6, 8, 2, 6, 42, 6, 34, 6, 8, 2, 6, 16, 58, 6, 104, 32, 97, 622, 18, 31, 96, 14, 18, 32, 32, 14, 18, 87, 5, 68, 96, 42, 6, 80, 80, 32, 16, 65, 63, 32, 135, 94, 64, 62, 43, 18, 64, 77, 13, 143, 5, 18, 256, 280, 8, 40, 8, 9, 2, 2, 2, 33, 54, 8, 4, 4, 10, 6, 10, 18, 4, 123, 14, 17, 114, 5, 3, 11, 4, 11, 2, 2, 2, 5, 13, 9, 9, 53, 2685, 48, 48, 139, 21, 48, 63, 17, 32, 8, 8, 8, 8, 8, 8, 8, 87, 470, 44, 10, 6, 92, 4, 91, 9, 44, 111, 80, 528, 6656, 20992, 1232, 48, 272, 26, 22, 63, 33, 119, 11, 105, 5, 16, 90, 9, 4, 5, 52, 66, 112, 9, 15, 38, 48, 36, 75, 49, 64, 4, 28, 26, 6, 49, 4, 4, 7, 2, 25, 38, 8, 8, 15, 8, 152, 64, 11184, 27, 8501, 304, 64, 144, 19, 10, 2, 11, 14, 6, 2, 3, 3, 141, 381, 66, 94, 128, 6, 171, 32, 37, 92, 8, 8, 8],
    DIGIT: [48, 1584, 144, 208, 422, 128, 128, 128, 128, 128, 128, 128, 128, 234, 128, 80, 288, 80, 1872, 48, 310, 138, 176, 16, 192, 96, 144, 16, 35280, 688, 48, 208, 128, 416, 21280],
    LETTER_NUMBER: [5870, 2674, 37, 3714, 26, 23, 30382],
    OTHER: [0, 58, 33, 32, 48, 11, 5, 28, 32, 459, 16, 19, 8, 2, 134, 3, 6, 9, 4, 2, 21, 84, 140, 166, 47, 3, 46, 99, 8, 88, 31, 6, 100, 2, 17, 22, 3, 17, 31, 118, 12, 57, 11, 5, 27, 5, 10, 4, 48, 225, 4, 19, 17, 14, 8, 8, 13, 4, 24, 8, 2, 7, 4, 17, 15, 4, 16, 25, 6, 24, 8, 3, 3, 3, 35, 2, 17, 5, 25, 4, 23, 8, 3, 6, 4, 19, 17, 14, 29, 4, 24, 8, 3, 6, 4, 32, 4, 14, 2, 18, 7, 6, 5, 5, 2, 3, 5, 6, 15, 23, 31, 29, 4, 24, 11, 6, 4, 28, 8, 14, 29, 4, 24, 11, 6, 4, 33, 3, 14, 3, 26, 4, 42, 3, 17, 19, 14, 16, 23, 27, 10, 2, 9, 106, 3, 19, 19, 41, 2, 4, 2, 3, 10, 8, 4, 2, 2, 4, 5, 3, 10, 7, 2, 19, 4, 35, 41, 30, 37, 32, 158, 31, 12, 8, 4, 5, 10, 17, 13, 11, 44, 53, 2, 332, 5, 9, 2, 5, 43, 5, 35, 5, 9, 2, 5, 17, 58, 5, 69, 53, 101, 632, 19, 27, 80, 6, 28, 5, 32, 32, 27, 4, 67, 36, 5, 13, 48, 94, 49, 2, 75, 39, 81, 7, 55, 28, 18, 61, 62, 53, 16, 14, 140, 24, 14, 71, 25, 44, 62, 38, 52, 111, 5, 206, 342, 8, 40, 8, 10, 2, 2, 2, 32, 55, 8, 2, 6, 8, 7, 8, 17, 8, 8, 117, 14, 29, 102, 5, 12, 2, 8, 7, 2, 2, 5, 12, 6, 10, 5, 58, 2726, 48, 134, 10, 55, 64, 10, 39, 16, 8, 8, 8, 8, 8, 8, 8, 81, 472, 34, 12, 7, 90, 9, 91, 5, 46, 97, 44, 69, 7094, 21014, 1217, 113, 271, 31, 67, 41, 88, 48, 105, 6, 3, 24, 88, 4, 5, 24, 81, 64, 38, 30, 4, 42, 33, 54, 54, 39, 79, 26, 9, 14, 29, 4, 53, 2, 5, 7, 3, 2, 27, 41, 8, 8, 16, 8, 180, 23, 11178, 35, 53, 8754, 64, 108, 45, 17, 6, 11, 14, 6, 2, 3, 3, 109, 396, 82, 56, 52, 121, 136, 29, 33, 32, 100, 9, 8, 8, 5]
};
const _CASE = {
    UPPER: [65, 127, 24, 40, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 3, 2, 2, 2, 2, 2, 2, 2, 3, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 3, 2, 4, 3, 2, 3, 5, 5, 3, 6, 3, 3, 2, 2, 3, 3, 2, 3, 4, 2, 5, 8, 3, 3, 3, 2, 2, 2, 2, 2, 2, 2, 3, 2, 2, 2, 2, 2, 2, 2, 2, 3, 3, 2, 4, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 8, 3, 4, 2, 5, 2, 2, 2, 290, 2, 4, 16, 2, 4, 2, 3, 18, 44, 3, 6, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 6, 3, 2, 4, 99, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 10, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 3, 2, 2, 2, 2, 2, 3, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 11, 2927, 3424, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 10, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 10, 16, 16, 16, 16, 17, 2, 2, 2, 9, 80, 16, 16, 16, 16, 266, 5, 4, 5, 5, 4, 11, 2, 2, 2, 6, 14, 7, 27, 35, 819, 1866, 96, 2, 5, 2, 2, 2, 5, 3, 9, 4, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 9, 2, 31059, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 20, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 140, 2, 2, 2, 2, 2, 2, 4, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 11, 2, 2, 3, 2, 2, 2, 5, 2, 3, 16, 2, 2, 2, 2, 22393],
    LOWER: [97, 73, 11, 5, 37, 25, 9, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 3, 2, 2, 2, 2, 2, 2, 2, 3, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 3, 2, 2, 5, 2, 3, 4, 6, 3, 4, 5, 3, 2, 2, 3, 2, 3, 3, 4, 2, 3, 4, 9, 3, 3, 2, 2, 2, 2, 2, 2, 2, 2, 3, 2, 2, 2, 2, 2, 2, 2, 2, 4, 2, 4, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 9, 3, 3, 5, 2, 2, 2, 2, 70, 43, 32, 101, 44, 2, 4, 3, 22, 28, 36, 5, 4, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 6, 3, 3, 53, 49, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 10, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 3, 2, 2, 2, 2, 2, 2, 3, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 58, 6047, 257, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 10, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 17, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 6, 8, 4, 4, 10, 6, 10, 18, 4, 154, 122, 4, 5, 28, 5, 5, 3, 10, 8, 34, 20, 844, 1888, 49, 4, 3, 2, 2, 5, 2, 3, 11, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 9, 2, 18, 31041, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 20, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 140, 2, 2, 2, 2, 2, 2, 4, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 11, 2, 3, 2, 2, 2, 2, 5, 2, 3, 16, 2, 2, 2, 2, 81, 21254, 19, 1070],
    OTHER: [0, 91, 32, 48, 11, 5, 28, 32, 196, 5, 5, 3, 3, 39, 162, 37, 9, 35, 97, 46, 4, 6, 9, 4, 2, 21, 84, 140, 166, 47, 49, 2878, 3322, 342, 8, 40, 8, 10, 2, 2, 2, 32, 10, 16, 16, 13, 7, 3, 6, 7, 8, 8, 17, 8, 7, 153, 110, 5, 12, 2, 8, 7, 2, 2, 5, 7, 5, 6, 10, 5, 49, 5, 869, 1861, 48, 134, 10, 55, 31048, 42, 240, 7, 3, 24, 81, 21260, 17, 1059, 32]
};
const _DIRECTIONALITY: any = {
    UNDEFINED: [888, 7, 12, 2, 21, 390, 47, 9, 40, 3, 61, 35, 10, 15, 24, 242, 61, 103, 73, 51, 17, 29, 3, 281, 8, 4, 9, 4, 24, 8, 2, 7, 11, 4, 6, 9, 6, 6, 24, 8, 7, 6, 24, 8, 3, 3, 3, 3, 6, 6, 5, 4, 11, 2, 23, 14, 10, 4, 23, 8, 3, 6, 12, 4, 4, 3, 19, 12, 2, 18, 9, 4, 24, 8, 3, 6, 11, 4, 5, 10, 6, 6, 20, 12, 7, 6, 5, 5, 2, 3, 5, 6, 15, 9, 6, 5, 3, 7, 35, 9, 9, 4, 24, 11, 6, 11, 4, 5, 9, 3, 10, 12, 16, 4, 9, 4, 24, 11, 6, 11, 4, 5, 9, 8, 5, 12, 3, 17, 9, 4, 42, 10, 4, 6, 9, 12, 18, 10, 4, 19, 27, 10, 2, 9, 4, 10, 2, 9, 21, 70, 33, 39, 2, 4, 2, 3, 10, 8, 4, 2, 2, 4, 14, 4, 7, 2, 7, 12, 4, 106, 37, 43, 37, 16, 14, 235, 55, 332, 5, 9, 2, 5, 43, 5, 35, 5, 9, 2, 5, 17, 58, 5, 69, 34, 29, 91, 680, 84, 28, 8, 34, 29, 25, 4, 3, 106, 12, 16, 21, 11, 94, 51, 75, 39, 15, 16, 5, 45, 7, 55, 30, 17, 65, 67, 30, 13, 16, 20, 158, 49, 46, 15, 58, 68, 18, 54, 115, 244, 303, 8, 40, 8, 10, 2, 2, 2, 32, 55, 16, 15, 8, 20, 5, 10, 102, 13, 29, 14, 29, 55, 153, 618, 51, 36, 693, 203, 2, 896, 13, 213, 48, 147, 52, 64, 11, 38, 16, 8, 8, 8, 8, 8, 8, 8, 83, 104, 90, 226, 38, 68, 87, 105, 46, 97, 44, 41, 59, 224, 6839, 21014, 1217, 58, 357, 72, 36, 96, 151, 3, 24, 130, 14, 62, 77, 21, 34, 88, 41, 81, 12, 6, 87, 23, 12, 34, 71, 29, 39, 8, 8, 16, 8, 191, 12, 11178, 35, 53, 8754, 64, 108, 45, 17, 31, 6, 2, 3, 3, 125, 382, 80, 56, 54, 28, 13, 44, 20, 5, 9, 136, 3, 191, 9, 8, 8, 5, 10, 8, 15],
    L: [65, 32, 73, 11, 5, 6, 24, 32, 451, 21, 16, 14, 130, 6, 4, 12, 2, 4, 2, 21, 84, 147, 167, 40, 8, 40, 890, 56, 2, 12, 5, 10, 12, 21, 9, 3, 10, 4, 23, 8, 4, 7, 10, 4, 3, 9, 5, 3, 7, 14, 15, 2, 10, 4, 23, 8, 3, 3, 6, 27, 5, 8, 12, 17, 2, 10, 4, 23, 8, 3, 8, 12, 2, 5, 16, 6, 28, 3, 10, 4, 23, 8, 3, 8, 3, 7, 4, 12, 5, 3, 7, 29, 2, 9, 4, 7, 3, 2, 5, 5, 6, 16, 3, 5, 4, 6, 7, 15, 27, 4, 9, 4, 24, 11, 8, 4, 23, 8, 6, 25, 3, 3, 9, 4, 24, 11, 8, 9, 4, 11, 9, 2, 6, 11, 17, 3, 9, 4, 43, 9, 4, 4, 9, 9, 6, 19, 9, 3, 21, 25, 10, 3, 15, 9, 26, 15, 49, 14, 15, 50, 3, 3, 3, 3, 7, 5, 8, 4, 2, 3, 3, 5, 11, 3, 6, 10, 12, 36, 26, 28, 2, 6, 11, 54, 6, 3, 54, 9, 7, 50, 49, 7, 3, 4, 27, 7, 20, 14, 4, 7, 16, 50, 48, 330, 6, 8, 2, 6, 42, 6, 34, 6, 8, 2, 6, 16, 58, 6, 72, 32, 32, 97, 640, 31, 96, 14, 18, 21, 11, 32, 14, 18, 62, 9, 13, 8, 4, 48, 16, 96, 42, 6, 80, 35, 6, 7, 3, 19, 42, 16, 48, 32, 48, 25, 5, 57, 10, 2, 10, 19, 16, 16, 100, 49, 6, 2, 6, 13, 36, 14, 36, 4, 4, 18, 39, 3, 4, 4, 10, 56, 7, 18, 134, 14, 8, 5, 18, 256, 280, 8, 40, 8, 9, 2, 2, 2, 33, 54, 8, 4, 4, 10, 6, 10, 18, 4, 24, 99, 14, 17, 114, 5, 3, 11, 4, 11, 2, 2, 2, 5, 13, 9, 9, 18, 470, 95, 263, 528, 340, 1024, 48, 48, 139, 21, 48, 63, 17, 32, 8, 8, 8, 8, 8, 8, 8, 557, 28, 16, 7, 9, 92, 4, 91, 9, 44, 95, 96, 48, 64, 31, 65, 16, 48, 123, 101, 32, 6656, 20992, 1232, 320, 48, 64, 32, 82, 48, 103, 7, 16, 90, 9, 4, 5, 27, 9, 16, 64, 78, 36, 14, 46, 36, 13, 36, 49, 6, 3, 18, 15, 34, 47, 4, 13, 4, 9, 3, 12, 36, 49, 4, 4, 7, 2, 25, 38, 8, 8, 15, 8, 152, 38, 3, 7, 16, 11184, 27, 53, 8752, 64, 144, 19, 1038, 32, 37, 92, 8, 8, 8],
    R: [1470, 2, 3, 3, 10, 32, 464, 52, 6, 6, 26, 10, 4, 8, 16, 30, 6065, 56078, 2, 11, 14, 6, 2, 3, 3],
    AL: [1544, 3, 2, 14, 3, 79, 4, 116, 9, 12, 21, 3, 59, 100, 62367, 131, 381, 66, 94, 128, 6],
    EN: [48, 130, 7, 1591, 6528, 4, 12, 1032, 55944],
    ES: [43, 2, 8269, 16, 392, 55575, 825, 169, 2],
    ET: [35, 127, 14, 1369, 97, 904, 9, 246, 264, 582, 2460, 2133, 112, 142, 229, 34341, 22055, 10, 154, 221, 5],
    AN: [1536, 96, 11, 114],
    CS: [44, 2, 12, 102, 1388, 6691, 21, 56844, 2, 3, 183, 2, 12],
    NSM: [768, 387, 270, 46, 2, 3, 3, 73, 59, 37, 102, 9, 8, 3, 39, 31, 118, 69, 43, 5, 10, 4, 48, 167, 58, 2, 5, 12, 4, 17, 31, 59, 5, 12, 21, 31, 59, 5, 6, 4, 6, 31, 5, 12, 59, 5, 6, 6, 21, 31, 59, 3, 2, 12, 9, 12, 32, 62, 13, 113, 8, 4, 11, 13, 90, 16, 22, 95, 12, 21, 104, 8, 4, 91, 3, 19, 106, 3, 7, 13, 80, 29, 2, 2, 56, 15, 6, 7, 12, 45, 103, 5, 7, 4, 27, 6, 19, 17, 3, 8, 16, 704, 949, 32, 32, 32, 69, 15, 3, 20, 46, 158, 119, 7, 11, 7, 222, 63, 2, 8, 2, 3, 14, 12, 129, 52, 2, 6, 6, 41, 21, 34, 6, 62, 2, 5, 2, 61, 10, 154, 4, 14, 11, 211, 60, 724, 3103, 144, 97, 586, 111, 30166, 13, 116, 274, 4, 5, 26, 159, 28, 70, 33, 57, 51, 3, 6, 109, 8, 4, 14, 9, 100, 2, 5, 7, 3, 292, 3, 5, 20273, 738, 32],
    BN: [0, 14, 113, 7, 39, 8030, 85, 10, 56981],
    B: [10, 3, 15, 105, 8100],
    S: [9, 2, 20],
    WS: [12, 20, 5728, 398, 2034, 40, 55, 4001],
    ON: [33, 5, 21, 32, 32, 38, 5, 5, 3, 6, 2, 5, 28, 32, 450, 9, 16, 19, 10, 133, 10, 6, 3, 111, 404, 124, 8, 208, 11, 269, 1021, 7, 126, 706, 1110, 112, 667, 341, 16, 320, 4, 154, 1503, 2, 14, 16, 16, 16, 19, 37, 16, 55, 16, 116, 3, 5, 12, 2, 8, 7, 2, 2, 17, 6, 10, 6, 57, 7, 132, 359, 27, 106, 64, 32, 138, 451, 84, 203, 2, 306, 592, 405, 20, 263, 128, 27, 101, 240, 17, 7, 40, 6, 7, 94, 5, 91, 197, 93, 51, 44, 53, 27, 171, 103, 33, 6593, 22224, 381, 102, 11, 130, 136, 160, 76, 21706, 191, 19, 32, 33, 3, 2, 10, 4, 4, 3, 150, 5, 21, 32, 32, 135, 6, 17],
    LRE: [8234],
    LRO: [8237],
    RLE: [8235],
    RLO: [8238],
    PDF: [8236]
};
const _MIRRORED = {
    YES: [40, 20, 2, 29, 2, 30, 2, 46, 16, 3711, 1889, 2462, 12, 56, 16, 179, 193, 7, 9, 4, 5, 5, 5, 2, 5, 14, 2, 23, 13, 3, 2, 10, 33, 9, 10, 4, 24, 11, 7, 6, 26, 24, 24, 9, 1087, 88, 3, 5, 4, 7, 9, 6, 417, 24, 29, 8, 9, 5, 6, 4, 9, 2, 5, 12, 8, 14, 20, 6, 2, 3, 2, 9, 8, 27, 13, 6, 5, 4, 6, 45, 9, 45, 2, 4, 10, 7, 4, 6, 773, 7, 3, 16, 4, 488, 12, 52805, 11, 164, 20, 2, 29, 2, 30, 2, 2, 3],
    NO: [0, 42, 19, 2, 29, 2, 30, 2, 46, 16, 3714, 1887, 2462, 12, 56, 16, 178, 196, 9, 4, 5, 7, 5, 2, 2, 13, 6, 19, 9, 11, 2, 9, 33, 6, 6, 11, 21, 7, 14, 4, 28, 18, 12, 22, 9, 1099, 75, 6, 3, 3, 10, 8, 17, 425, 23, 9, 13, 4, 9, 3, 7, 5, 4, 4, 16, 4, 31, 5, 3, 2, 3, 5, 7, 9, 26, 13, 8, 3, 4, 47, 10, 41, 6, 2, 8, 8, 5, 8, 2, 776, 5, 3, 16, 12, 488, 10, 52803, 7, 164, 19, 2, 29, 2, 30, 2, 3, 3]
};
const _NAMEMID = {
    YES: [36, 12, 17, 30, 2, 73, 11, 5, 6, 24, 32, 462, 26, 12, 2, 18, 118, 4, 12, 2, 4, 2, 21, 84, 140, 7, 167, 40, 8, 48, 46, 2, 3, 3, 9, 32, 32, 16, 78, 103, 10, 11, 21, 17, 61, 115, 58, 6, 64, 192, 102, 11, 8, 8, 4, 10, 4, 23, 8, 4, 6, 11, 4, 12, 5, 3, 7, 27, 4, 10, 4, 23, 8, 3, 3, 4, 2, 9, 4, 6, 8, 5, 8, 27, 4, 10, 4, 23, 8, 3, 7, 11, 4, 5, 16, 6, 27, 4, 10, 4, 23, 8, 3, 7, 11, 4, 11, 6, 3, 7, 11, 17, 3, 9, 4, 7, 3, 2, 5, 5, 6, 16, 8, 4, 6, 7, 15, 27, 4, 9, 4, 24, 11, 8, 9, 4, 11, 3, 8, 6, 28, 3, 9, 4, 24, 11, 7, 10, 4, 11, 9, 2, 6, 11, 17, 3, 9, 4, 43, 9, 4, 13, 9, 6, 20, 8, 3, 21, 25, 10, 3, 10, 5, 7, 2, 26, 15, 63, 16, 49, 3, 3, 3, 3, 7, 5, 8, 4, 2, 3, 3, 14, 5, 6, 2, 8, 12, 36, 24, 8, 21, 2, 2, 5, 11, 40, 21, 19, 45, 58, 80, 80, 48, 44, 4, 330, 6, 8, 2, 6, 42, 6, 34, 6, 8, 2, 6, 16, 58, 6, 69, 35, 32, 97, 622, 18, 31, 78, 18, 14, 18, 32, 32, 14, 4, 14, 54, 33, 5, 4, 43, 5, 16, 96, 48, 80, 32, 16, 22, 42, 16, 48, 32, 48, 32, 64, 31, 17, 23, 89, 80, 27, 21, 46, 18, 64, 64, 13, 131, 4, 44, 252, 284, 8, 40, 8, 9, 2, 2, 2, 33, 54, 8, 4, 4, 10, 6, 10, 18, 4, 22, 51, 21, 29, 14, 17, 64, 17, 4, 29, 5, 3, 11, 4, 11, 2, 2, 2, 5, 13, 9, 9, 18, 2720, 48, 48, 139, 21, 48, 63, 16, 33, 8, 8, 8, 8, 8, 8, 8, 8, 79, 470, 28, 16, 7, 9, 88, 4, 4, 91, 9, 44, 111, 80, 528, 6656, 20992, 1232, 48, 272, 48, 60, 3, 33, 119, 11, 105, 5, 16, 90, 70, 64, 80, 16, 27, 5, 48, 48, 32, 79, 49, 64, 16, 16, 26, 6, 91, 38, 8, 8, 15, 8, 152, 44, 4, 16, 11184, 27, 8501, 304, 64, 144, 19, 10, 13, 14, 6, 2, 3, 3, 141, 381, 66, 94, 16, 32, 19, 26, 35, 6, 154, 17, 30, 2, 37, 92, 8, 8, 8],
    NO: [0, 37, 21, 33, 5, 27, 48, 11, 5, 28, 32, 459, 16, 19, 8, 2, 134, 3, 6, 9, 4, 2, 21, 84, 140, 6, 160, 47, 3, 46, 54, 2, 3, 3, 2, 35, 8, 40, 79, 106, 9, 12, 20, 3, 75, 103, 68, 5, 51, 46, 264, 12, 8, 8, 4, 9, 4, 24, 8, 2, 7, 11, 4, 6, 9, 6, 6, 14, 18, 7, 6, 24, 8, 3, 3, 3, 3, 6, 6, 5, 4, 11, 2, 23, 14, 10, 4, 23, 8, 3, 6, 12, 4, 4, 3, 19, 12, 20, 9, 4, 24, 8, 3, 6, 11, 4, 5, 10, 6, 6, 12, 2, 18, 7, 6, 5, 5, 2, 3, 5, 6, 15, 9, 6, 5, 3, 7, 24, 20, 9, 4, 24, 11, 6, 11, 4, 5, 9, 3, 10, 12, 20, 9, 4, 24, 11, 6, 11, 4, 5, 9, 8, 5, 12, 3, 17, 9, 4, 42, 10, 4, 6, 9, 12, 12, 16, 4, 19, 27, 10, 2, 9, 4, 10, 2, 9, 20, 71, 20, 11, 41, 2, 4, 2, 3, 10, 8, 4, 2, 2, 4, 14, 4, 7, 2, 7, 12, 4, 35, 25, 16, 12, 2, 2, 14, 37, 24, 19, 37, 10, 131, 84, 40, 53, 2, 332, 5, 9, 2, 5, 43, 5, 35, 5, 9, 2, 5, 17, 58, 5, 69, 5, 48, 101, 632, 19, 27, 80, 6, 28, 8, 32, 31, 25, 4, 3, 64, 32, 4, 6, 12, 36, 12, 94, 51, 75, 39, 15, 16, 50, 7, 55, 30, 16, 66, 67, 30, 13, 16, 14, 164, 14, 26, 55, 15, 58, 68, 18, 52, 85, 32, 244, 303, 8, 40, 8, 10, 2, 2, 2, 32, 55, 8, 2, 6, 8, 7, 8, 17, 8, 8, 17, 51, 20, 29, 14, 29, 64, 5, 15, 18, 5, 12, 2, 8, 7, 2, 2, 5, 12, 6, 10, 5, 58, 2726, 48, 134, 13, 52, 64, 10, 39, 16, 8, 8, 8, 8, 8, 8, 8, 33, 48, 472, 40, 6, 7, 90, 4, 5, 91, 5, 46, 97, 44, 69, 7094, 21014, 1217, 113, 271, 31, 68, 14, 26, 90, 46, 105, 6, 3, 24, 126, 76, 81, 21, 30, 4, 50, 38, 41, 68, 25, 93, 23, 12, 29, 5, 71, 27, 41, 8, 8, 16, 8, 188, 3, 12, 11178, 35, 53, 8754, 64, 108, 45, 17, 17, 14, 6, 2, 3, 3, 109, 396, 82, 56, 52, 20, 23, 14, 27, 37, 136, 29, 33, 5, 27, 100, 9, 8, 8, 5]
};
const _WHITESPACE = {
    YES: [9, 19, 5732, 398, 2034, 8, 32, 55, 4001],
    NO: [0, 14, 19, 5728, 398, 2040, 4, 31, 54, 4001]
};
//!end data

//Reserved ECMAScript keywords
const _RESERVED: any = { "break": 1, "case": 1, "catch": 1, "class": 1, "const": 1, "continue": 1, "debugger": 1, "default": 1, "delete": 1, "do": 1, "else": 1, "enum": 1, "export": 1, "extends": 1, "finally": 1, "for": 1, "function": 1, "if": 1, "implements": 1, "import": 1, "in": 1, "instanceof": 1, "interface": 1, "let": 1, "new": 1, "package": 1, "private": 1, "protected": 1, "public": 1, "return": 1, "static": 1, "super": 1, "switch": 1, "this": 1, "throw": 1, "try": 1, "typeof": 1, "var": 1, "void": 1, "while": 1, "with": 1, "yield": 1 };

//  The objective of inflateProperty is to inflate propSet argument into a usable data structure.
//
//  The propSet argument is an object:
//    Each property in the propSet is an array.
//    Each number in the array represents a codepoint where that property is turned on (the codepoint before being off).
//    Instead of representing the codepoint in unicode, it represents the distance from the last switch on.
//
//  Inflated structure for _GTYPE would look like this:
//   _GTYPE:{ LETTER:1, DIGIT: 2, OTHER: 3, CODEPOINTS: [ [0,3],[48,2],[58,3],[65,1]... } }
//  where in CODEPOINTS array of arrays the first element is the position and the second element is the type
export const inflateProperty = function (propSet: any) {
    var
        ci,
        prpnam,
        prpmap: any = {}, //maps the property to a number
        prpcnt = 0,
        prppos: any = {}, //the next position of this property
        codpnt: any[] = []; //the final output we want

    for (prpnam in propSet) {
        prpmap[prpnam] = ++prpcnt;
        prppos[prpnam] = propSet[prpnam].shift();
        if (prppos[prpnam] === 0) {
            codpnt.push([0, prpmap[prpnam]]);
            prppos[prpnam] = propSet[prpnam].shift();
        }
    }

    for (ci = 1; ci < 65535; ci++) {
        for (prpnam in propSet) {
            if (ci == prppos[prpnam]) {
                codpnt.push([ci, prpmap[prpnam]]);
                prppos[prpnam] = ci + propSet[prpnam].shift();
            }
        }
    }

    propSet.CODEPOINTS = codpnt;
    for (prpnam in prpmap) {
        propSet[prpnam] = prpmap[prpnam];
    }
};
//Returns the value of this character according to the propSet in question
export const getProperty = function (propSet: any, ch: any) {
    assertChar(String.fromCharCode(ch));
    if (!propSet.CODEPOINTS) { inflateProperty(propSet); } //only done when needed.  this is pretty fast so ok to do it inline
    return findProperty(ch/* .charCodeAt(0) */, propSet.CODEPOINTS, 0, propSet.CODEPOINTS.length);
};

//Check if this is a valid length 1 string "char" argument
export const assertChar = function (ch: any) {
    if (typeof ch != 'string' || ch.length != 1) { throw new Error('A length 1 string is required for "ch" arguments.'); }
};
//Check if this is a valid string
export const assertString = function (string: string) {
    if (typeof string != "string") { throw new Error("A string is required"); }
};
//Check if this is a valid function
export const assertFunction = function (callback: Function) {
    if (typeof callback != "function") { throw new Error("A function is required for callback"); }
};

//Helper function for getProperty which navigates the CODEPOINT structure
export const findProperty = function (ci: any, codpnt: any, str: any, end: any): any {
    var mid = Math.floor((str + end) / 2);
    if (codpnt[mid][0] <= ci && (mid >= codpnt.length - 1 || codpnt[mid + 1][0] > ci)) {
        return codpnt[mid][1];
    }
    else if (codpnt[mid][0] > ci) {
        return findProperty(ci, codpnt, str, mid);
    }
    else {
        return findProperty(ci, codpnt, mid, end);
    }
};

/**
 *  Used to find the directionality, which is handled a bit differently than the other sets of properties since we need a value back, not just true/false.
 *  Returns one of the following:
 *  + `UNDEFINED`
 *  + `L`   for LEFT_TO_RIGHT
 *  + `R`   for RIGHT_TO_LEFT
 *  + `AL`  for RIGHT_TO_LEFT_ARABIC
 *  + `EN`  for EUROPEAN_NUMBER
 *  + `ES`  for EUROPEAN_NUMBER_SEPARATOR
 *  + `ET`  for EUROPEAN_NUMBER_TERMINATOR
 *  + `AN`  for ARABIC_NUMBER
 *  + `CS`  for COMMON_NUMBER_SEPARATOR
 *  + `NSM` for NONSPACING_MARK
 *  + `BN`  for BOUNDARY_NEUTRAL
 *  + `B`   for PARAGRAPH_SEPARATOR
 *  + `S`   for SEGMENT_SEPARATOR
 *  + `WS`  for WHITESPACE
 *  + `ON`  for OTHER_NEUTRALS
 *  + `LRE` for LEFT_TO_RIGHT_EMBEDDING
 *  + `LRO` for LEFT_TO_RIGHT_OVERRIDE
 *  + `RLE` for RIGHT_TO_LEFT_EMBEDDING
 *  + `RLO` for RIGHT_TO_LEFT_OVERRIDE
 *  + `PDF` for POP_DIRECTIONAL_FORMAT
 *
 *  @param {String} string - a length 1 string
 *  @returns {String} a string representing the directionality, as defined above
 */
export const getDirectionality = function (ch: any) {
    assertChar(ch);
    var dir, pi;
    dir = getProperty(_DIRECTIONALITY, ch);
    for (pi in _DIRECTIONALITY) {
        if (_DIRECTIONALITY[pi] == dir) return pi;
    }
};

/**
 *  Returns an array of contiguous matching strings for which the callback returns true, similar to String.match().
 *  `CharFunk.getMatches("test this out",CharFunk.isLetter); // returns ["test","this","out"]`
 *  @param {String} string - a string of any length
 *  @param {Function} callback - a function to call for each character, which must return true if a match or false if not a match.  This function will be provided three arguments: a char to check, a number for the position, and a number for the string length
 *  @returns {Array{String}}
 */
export const getMatches = function (string: string, callback: Function) {
    assertString(string); assertFunction(callback);
    var ci, rtn, wrd;
    rtn = []; //return array
    wrd = null; //current word
    for (ci = 0; ci < string.length; ci++) {
        if (callback(string.charAt(ci), ci, string.length)) {
            if (wrd === null) wrd = "";
            wrd += string.charAt(ci);
        }
        else {
            if (wrd !== null) rtn.push(wrd);
            wrd = null;
        }
    }
    if (wrd !== null) rtn.push(wrd);
    return rtn;
};

/**
 *  Returns true if the string argument is composed of all letters and digits
 *  @param {String} string - a string of any length
 *  @returns {Boolean}
 */
export const isAllLettersOrDigits = function (string: string) {
    assertString(string);
    var ci;
    for (ci = 0; ci < string.length; ci++) {
        if (!isLetterOrDigit(string.charAt(ci))) return false;
    }
    return true;
};

/**
 *  Returns true if provided a length 1 string that is a digit
 *  @param {String} ch - a length 1 string
 *  @returns {Boolean}
 */
export const isDigit = function (ch: string) {
    return (getProperty(_GTYPE, ch) == _GTYPE.DIGIT);
};

export function isSpace(aChar: any) {
    const myCharCode = aChar.charCodeAt(0);

    if (((myCharCode > 8) && (myCharCode < 14)) ||
        (myCharCode == 32)) {
        return true;
    }

    return false;
}

/**
 *  Returns true if provided a length 1 string that is a letter
 *  @param {String} ch - a length 1 string
 *  @returns {Boolean}
 */
export const isLetter = function (ch: any) {
    return (getProperty(_GTYPE, ch) == _GTYPE.LETTER);
};

/**
 *  Returns true if provided a length 1 string that is in the Unicode "Nl" category.
 *  Beware -- this is NOT the same thing as isLetterOrDigit()!
 *  @param {String} ch - a length 1 string
 *  @returns {Boolean}
 */
export const isLetterNumber = function (ch: any) {
    return (getProperty(_GTYPE, ch) == _GTYPE.LETTER_NUMBER);
};

/**
 *  Returns true if provided a length 1 string that is a letter or a digit
 *  @param {String} ch - a length 1 string
 *  @returns {Boolean}
 */
export const isLetterOrDigit = function (ch: any) {
    var typ = getProperty(_GTYPE, ch);
    return (typ == _GTYPE.LETTER || typ == _GTYPE.DIGIT);
};

/**
 *  Returns true if provided a length 1 string that is lowercase
 *  @param {String} ch - a length 1 string
 *  @returns {Boolean}
 */
export const isLowerCase = function (ch: any) {
    return (getProperty(_CASE, ch) == _CASE.LOWER);
};

/**
 *  Returns true if provided a length 1 string that is a mirrored character
 *  @param {String} ch - a length 1 string
 *  @returns {Boolean}
 */
export const isMirrored = function (ch: any) {
    return (getProperty(_MIRRORED, ch) == _MIRRORED.YES);
};

/**
 *  Returns true if provided a length 1 string that is uppercase
 *  @param {String} ch - a length 1 string
 *  @returns {Boolean}
 */
export const isUpperCase = function (ch: any) {
    return (getProperty(_CASE, ch) == _CASE.UPPER);
};

/**
 *  Returns true if provided a length 1 string that is a valid leading character for a JavaScript identifier
 *  @param {String} ch - a length 1 string
 *  @returns {Boolean}
 */
export const isValidFirstForName = function (ch: any) {
    assertChar(ch);
    //From the excellent http://mathiasbynens.be/notes/javascript-identifiers
    //  An identifier must start with $, _, or any character in the Unicode categories
    //  “Uppercase letter (Lu)”, “Lowercase letter (Ll)”, “Titlecase letter (Lt)”,
    //  “Modifier letter (Lm)”, “Other letter (Lo)”, or “Letter number (Nl)”.
    //Which matches Java EXCEPT FOR the lead "$" and "_" ... but also the Letter number being allowed.
    return (ch.charAt(0) == '_' || ch.charAt(0) == '$' || isLetter(ch.charAt(0)) || isLetterNumber(ch.charAt(0)));
};

/**
 *  Returns true if provided a length 1 string that is a valid non-leading character for a ECMAScript identifier
 *  @param {String} ch - a length 1 string
 *  @returns {Boolean}
 */
export const isValidMidForName = function (ch: any) {
    //see the GenCharFunkData.java explanation for namemid
    return (getProperty(_NAMEMID, ch) == _NAMEMID.YES);
};

/**
 *  Returns true if the string is a valid ECMAScript identifier.
 *  This is a bit more restrictive than browsers tend to be, using the actual rules http://www.ecma-international.org/ecma-262/5.1/
 *  @param {String} string - a string of any length
 *  @param {Boolean} checkReserved - set to true if you wish to get back false if string is a reserved ECMAScript keyword
 *  @returns {Boolean}
 */
export const isValidName = function (string: string, checkReserved: any) {
    assertString(string);

    if (checkReserved && _RESERVED[string]) return false;

    if (!isValidFirstForName(string.charAt(0))) return false;
    for (var ci = 1; ci < string.length; ci++) {
        if (!isValidMidForName(string.charAt(ci))) return false;
    }
    return true;
};

/**
 *  Returns true if provided a length 1 string that is a whitespace character
 *  @param {String} ch - a length 1 string
 *  @returns {Boolean}
 */
export const isWhitespace = function (ch: any) {
    return (getProperty(_WHITESPACE, ch) == _WHITESPACE.YES);
};

/**
 *  Returns the first index where the character causes a true return from the callback, or -1 if no match
 *  @param {String} string - a string of any length
 *  @param {Function} callback - a function to call for each character, which must return true if a match or false if not a match.  This function will be provided three arguments: a char to check, a number for the position, and a number for the string length
 *  @returns {Number}
 */
export const indexOf = function (string: string, callback: Function) {
    assertString(string); assertFunction(callback);
    var ci;
    for (ci = 0; ci < string.length; ci++) {
        if (callback(string.charAt(ci), ci, string.length)) return ci;
    }
    return -1;
};

/**
 *  Returns the last index where the character causes a true return from the callback, or -1 if no match
 *  @param {String} string - a string of any length
 *  @param {Function} callback - a function to call for each character, which must return true if a match or false if not a match.  This function will be provided three arguments: a char to check, a number for the position, and a number for the string length
 *  @returns {Number}
 */
export const lastIndexOf = function (string: string, callback: Function) {
    assertString(string); assertFunction(callback);
    var ci;
    for (ci = string.length - 1; ci > -1; ci--) {
        if (callback(string.charAt(ci), ci, string.length)) return ci;
    }
    return -1;
};

/**
 *  Returns true if all characters in the provided string result in a true return from the callback.
 *  @param {String} string - a string of any length
 *  @param {Function} callback - a function to call for each character, which must return true if a match or false if not a match.  This function will be provided three arguments: a char to check, a number for the position, and a number for the string length
 *  @returns {Boolean}
 */
export const matchesAll = function (string: string, callback: Function) {
    assertString(string); assertFunction(callback);
    var ci;
    for (ci = 0; ci < string.length; ci++) {
        if (!callback(string.charAt(ci), ci, string.length)) return false;
    }
    return true;
};

/**
 *  Returns a new string with all matched characters replaced, similar to String.replace().
 *  If the callback returns a string, then that will be used as the replacement.
 *  Otherwise, if a ch argument is provided, then that will be used as a replacement.
 *  If the callback does not return a string and the ch is not provided, then matched characters will simply be removed.
 *  @param {String} string - a string of any length
 *  @param {Function} callback - a function to call for each character, which must return a string as a replacement value, otherwise a true if a match or false if not a match.  This function will be provided three arguments: a char to check, a number for the position, and a number for the string length
 *  @param {String} ch - optional, a length 1 string for replacement
 *  @returns {String} a new string
 */
export const replaceMatches = function (string: string, callback: Function, ch: number) {
    assertString(string); assertFunction(callback);
    if (ch) assertChar(ch);
    var ci, rsl, rtn;
    rtn = [];
    for (ci = 0; ci < string.length; ci++) {
        rsl = callback(string.charAt(ci), ci, string.length);
        if (typeof rsl == "string") {
            rtn.push(rsl);
        }
        else if (rsl === true && ch) {
            rtn.push(ch);
        }
        else if (rsl === false) {
            rtn.push(string.charAt(ci));
        }
        //if ch is not provided, then this spot just get's skipped, removing this character
    }
    return rtn.join("");
};

/**
 *  Splits the string on all matches, similar to String.split().
 *  `CharFunk.splitOnMatches("test this out",CharFunk.isWhitespace); // returns ["test","this","out"]`
 *  @param {String} string - a string of any length
 *  @param {Function} callback - a function to call for each character, which must return true if a match or false if not a match.  This function will be provided three arguments: a char to check, a number for the position, and a number for the string length
 *  @returns {Boolean}
 */
export const splitOnMatches = function (string: string, callback: Function) {
    return getMatches(string, function (ch: any, ci: any, len: any) {
        return !callback(ch, ci, len);
    });
};
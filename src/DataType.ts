export default abstract class DataType {
    /**
     * Returns a string representation of the DataType, e.g. SignificantNumbers are returned in
     * scientific notation with correct significance preserved
     * @returns {string}
     */
    abstract toString(): string;
}

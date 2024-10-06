export const formatTimestamp = (value) => {
    const date = new Date(value);
    return `${String(date.getFullYear())}/${String(date.getMonth() + 1).padStart(2, '0')}/${String(date.getDate()).padStart(2, '0')}`;
};

export const formatDate = (value) => {
    return value.toLocaleDateString('ja-JP', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    });
}

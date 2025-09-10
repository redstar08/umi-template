export const ImageObserver = new IntersectionObserver(
    (entries, observer) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                const image = entry.target as HTMLImageElement;
                const dataSrc = image.getAttribute('data-src');

                if (dataSrc) {
                    image.src = dataSrc;
                    image.removeAttribute('data-src');
                    observer.unobserve(image);
                }
            }
        });
    },
    {
        threshold: 0.1,
        rootMargin: '50px',
    },
);

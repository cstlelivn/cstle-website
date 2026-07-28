import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { galleryContent } from '../content/gallery-content';
import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { fetchGalleryAlbums, fetchGalleryItems, type GalleryAlbum, type GalleryItem } from '../lib/gallery';

// Album cover with cascading fallback: coverUrl → next images → placeholder
function AlbumCoverImage({ album }: { album: GalleryAlbum }) {
  const [imgIndex, setImgIndex] = useState<number | null>(null); // null = use coverUrl
  const [failed, setFailed] = useState(false);

  // Collect all candidate URLs: coverUrl first, then each image's thumbnailUrl/url
  const candidates: string[] = [];
  if (album.coverUrl) candidates.push(album.coverUrl);
  for (const img of album.images) {
    if (img.thumbnailUrl && !candidates.includes(img.thumbnailUrl)) candidates.push(img.thumbnailUrl);
    if (img.url && !candidates.includes(img.url)) candidates.push(img.url);
  }

  const currentSrc = imgIndex === null ? (album.coverUrl ?? '') : (candidates[imgIndex] ?? '');

  const handleError = useCallback(() => {
    const nextIndex = imgIndex === null ? 1 : (imgIndex ?? 0) + 1;
    if (nextIndex < candidates.length) {
      setImgIndex(nextIndex);
    } else {
      setFailed(true);
    }
  }, [imgIndex, candidates]);

  if (failed || !currentSrc) {
    return <div className="absolute inset-0 bg-gradient-to-br from-[#d9d9d9] to-[#f1f1f1]" />;
  }

  return (
    <img
      alt={`${album.name} project cover`}
      className="absolute inset-0 max-w-none object-cover pointer-events-none size-full transition-transform duration-500 group-hover:scale-110"
      src={currentSrc}
      referrerPolicy="no-referrer"
      loading="lazy"
      crossOrigin="anonymous"
      onError={handleError}
    />
  );
}

export function Gallery() {
  const [albums, setAlbums] = useState<GalleryAlbum[]>([]);
  const [allImages, setAllImages] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [activeAlbum, setActiveAlbum] = useState<GalleryAlbum | null>(null);
  const [viewMode, setViewMode] = useState<'albums' | 'all'>('albums');
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isFullscreenOpen, setIsFullscreenOpen] = useState(false);

  useEffect(() => {
    async function loadGalleryData() {
      try {
        const [albumsData, imagesData] = await Promise.all([
          fetchGalleryAlbums(),
          fetchGalleryItems()
        ]);
        setAlbums(albumsData);
        setAllImages(imagesData);
      } catch (error: unknown) {
        const e = error as { code?: string; message?: string };
        console.error('[Gallery] load failed:', e?.code, e?.message, error);
        setLoadError(true);
      } finally {
        setLoading(false);
      }
    }

    loadGalleryData();
  }, []);

  // Close lightbox on Escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (isFullscreenOpen) {
          setIsFullscreenOpen(false);
        } else if (activeAlbum) {
          setActiveAlbum(null);
        }
      }
    };

    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [activeAlbum, isFullscreenOpen]);

  // Prevent body scroll when fullscreen viewer is open
  useEffect(() => {
    if (isFullscreenOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isFullscreenOpen]);

  // Navigation functions for fullscreen viewer
  const goPrev = () => {
    if (activeAlbum) {
      setActiveImageIndex((prev) =>
        prev === 0 ? activeAlbum.images.length - 1 : prev - 1
      );
    }
  };

  const goNext = () => {
    if (activeAlbum) {
      setActiveImageIndex((prev) =>
        prev === activeAlbum.images.length - 1 ? 0 : prev + 1
      );
    }
  };

  return (
    <div className="bg-white content-stretch flex flex-col gap-[40px] md:gap-[69px] items-start relative min-h-screen w-full">
      {/* Header Section */}
      <div className="bg-gradient-to-b from-[#d9d9d9] to-[#ffffff] w-full">
        <div className="flex flex-col items-center size-full">
          <div className="box-border content-stretch flex flex-col gap-[40px] md:gap-[80px] items-center px-px py-[28px] md:py-[56px] relative w-full">
            <Header />
            
            <div className="box-border content-stretch flex flex-col items-start px-[20px] md:px-[16px] py-0 relative shrink-0 w-full max-w-[704px]">
              <div className="relative shrink-0 w-full">
                <div className="flex flex-row items-center justify-center size-full">
                  <div className="box-border content-stretch flex gap-[10px] items-center justify-center px-[10px] md:px-[23px] py-0 relative w-full">
                    <h1 className="font-['Anybody',_sans-serif] leading-[1.031] relative shrink-0 text-[#191919] text-[28px] md:text-[39.075px] text-center tracking-[-1.12px] md:tracking-[-1.563px] hyphens-none" style={{ fontVariationSettings: "'wdth' 137", fontWeight: 700 }}>
                      {galleryContent.hero.title}
                    </h1>
                  </div>
                </div>
              </div>
              <div className="relative shrink-0 w-full">
                <div className="flex flex-row items-center justify-center size-full">
                  <div className="box-border content-stretch flex gap-[10px] items-center justify-center p-[10px] relative w-full">
                    <p className="font-['Anybody',_sans-serif] leading-[1.64] relative shrink-0 text-[#191919] text-[13px] md:text-[15px] text-center tracking-[-0.52px] md:tracking-[-0.6px]" style={{ fontVariationSettings: "'wdth' 137", fontWeight: 700 }}>
                      {galleryContent.hero.subtitle}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* View Mode Toggle */}
      {!loading && (albums.length > 0 || allImages.length > 0) && (
        <div className="relative shrink-0 w-full max-w-[1800px] mx-auto">
          <div className="flex justify-end px-[20px] md:px-[40px] lg:px-[60px]">
            <button
              type="button"
              onClick={() => setViewMode(viewMode === 'albums' ? 'all' : 'albums')}
              className="border border-[#191919]/10 rounded-full px-4 py-2 text-[12px] md:text-[13px] font-['Anybody',_sans-serif] tracking-[-0.4px] hover:bg-[#191919] hover:text-white transition-colors duration-200"
              style={{ fontVariationSettings: "'wdth' 137", fontWeight: 600 }}
            >
              {viewMode === 'albums' ? 'View all images' : 'Show albums'}
            </button>
          </div>
        </div>
      )}

      {/* Gallery Grid */}
      <div className="relative shrink-0 w-full mb-[40px] md:mb-[69px] max-w-[1800px] mx-auto">
        <div className="flex flex-row items-center justify-center size-full">
          <div className="box-border content-center grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-[20px] md:gap-[30px] lg:gap-[40px] items-center justify-center px-[20px] md:px-[40px] lg:px-[60px] py-0 relative w-full">
            {loading ? (
              <div className="text-center py-20 col-span-full">
                <p className="font-['Anybody',_sans-serif] text-[#191919]" style={{ fontVariationSettings: "'wdth' 137", fontWeight: 500, fontSize: '18px' }}>
                  Loading gallery...
                </p>
              </div>
            ) : loadError ? (
              <div className="text-center py-20 col-span-full flex flex-col items-center gap-[24px]">
                <h2 className="font-['Anybody',_sans-serif] text-[#191919] text-[22px] md:text-[28px] tracking-[-0.88px]" style={{ fontVariationSettings: "'wdth' 137", fontWeight: 700 }}>
                  Our project gallery is being updated.
                </h2>
                <p className="font-['Anybody',_sans-serif] text-[#191919]/70 text-[14px] md:text-[15px] tracking-[-0.56px] max-w-[500px]" style={{ fontVariationSettings: "'wdth' 137", fontWeight: 500 }}>
                  {"We're preparing more examples of our work. Contact us to discuss your project or request photographs relevant to the work you're planning."}
                </p>
                <div className="flex flex-col sm:flex-row gap-[10px]">
                  <Link to="/book" className="bg-[#191919] rounded-[32px] px-[32px] py-[14px] font-['Roboto_Mono',_sans-serif] text-[12px] text-white uppercase hover:bg-black/90 transition-colors">
                    Request a Free Estimate
                  </Link>
                  <Link to="/contact" className="border border-[#191919]/20 rounded-[32px] px-[32px] py-[14px] font-['Roboto_Mono',_sans-serif] text-[12px] text-[#191919] uppercase hover:bg-[#191919]/5 transition-colors">
                    Contact Us
                  </Link>
                </div>
              </div>
            ) : viewMode === 'albums' ? (
              // Albums view - one card per album
              albums.length === 0 ? (
                <div className="text-center py-20 col-span-full flex flex-col items-center gap-[24px]">
                  <h2 className="font-['Anybody',_sans-serif] text-[#191919] text-[22px] md:text-[28px] tracking-[-0.88px]" style={{ fontVariationSettings: "'wdth' 137", fontWeight: 700 }}>
                    Our project gallery is being updated.
                  </h2>
                  <p className="font-['Anybody',_sans-serif] text-[#191919]/70 text-[14px] md:text-[15px] tracking-[-0.56px] max-w-[500px]" style={{ fontVariationSettings: "'wdth' 137", fontWeight: 500 }}>
                    {"We're preparing more examples of our work. Contact us to discuss your project or request photographs relevant to the work you're planning."}
                  </p>
                  <div className="flex flex-col sm:flex-row gap-[10px]">
                    <Link to="/book" className="bg-[#191919] rounded-[32px] px-[32px] py-[14px] font-['Roboto_Mono',_sans-serif] text-[12px] text-white uppercase hover:bg-black/90 transition-colors">
                      Request a Free Estimate
                    </Link>
                    <Link to="/contact" className="border border-[#191919]/20 rounded-[32px] px-[32px] py-[14px] font-['Roboto_Mono',_sans-serif] text-[12px] text-[#191919] uppercase hover:bg-[#191919]/5 transition-colors">
                      Contact Us
                    </Link>
                  </div>
                </div>
              ) : (
                albums.map((album) => (
                  <div 
                    key={album.id}
                    onClick={() => setActiveAlbum(album)}
                    className="bg-[rgba(255,255,255,0)] box-border content-stretch flex flex-col gap-[10px] h-[280px] sm:h-[320px] md:h-[350px] lg:h-[400px] items-start overflow-clip relative rounded-[16px] md:rounded-[20px] lg:rounded-[24px] shadow-[0px_36px_30.9px_-27px_rgba(0,0,0,0.46),0px_4px_6px_-4px_rgba(0,0,0,0.1)] shrink-0 group cursor-pointer transition-all duration-300 hover:shadow-[0px_50px_40px_-30px_rgba(0,0,0,0.5),0px_8px_10px_-4px_rgba(0,0,0,0.15)]"
                  >
                    <div className="basis-0 content-stretch flex gap-[10px] grow items-start min-h-px min-w-px overflow-clip relative shrink-0 w-full">
                      <AlbumCoverImage album={album} />
                      {/* Always visible on mobile, hover-only on desktop */}
                      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent px-4 py-3 md:py-4 lg:py-6 text-white pointer-events-none md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-300">
                        <p className="font-['Roboto_Mono',_sans-serif] text-[9px] md:text-[10px] uppercase tracking-[0.16em] md:tracking-wider mb-1 md:mb-2 text-white/80">
                          {album.imageCount} {album.imageCount === 1 ? 'photo' : 'photos'}
                        </p>
                        <h3 className="font-['Anybody',_sans-serif] text-[13px] md:text-[14px] lg:text-[15px] tracking-[-0.52px] md:tracking-[-0.6px]" style={{ fontVariationSettings: "'wdth' 137", fontWeight: 700 }}>
                          {album.name}
                        </h3>
                      </div>
                    </div>
                  </div>
                ))
              )
            ) : (
              // All images view - flat list
              allImages.length === 0 ? (
                <div className="text-center py-20 col-span-full">
                  <p className="font-['Anybody',_sans-serif] text-[#191919]" style={{ fontVariationSettings: "'wdth' 137", fontWeight: 500, fontSize: '18px' }}>
                    No gallery items yet. Check back soon!
                  </p>
                </div>
              ) : (
                allImages.map((item) => (
                  <div 
                    key={item.id}
                    className="bg-[rgba(255,255,255,0)] box-border content-stretch flex flex-col gap-[10px] h-[280px] sm:h-[320px] md:h-[350px] lg:h-[400px] items-start overflow-clip relative rounded-[16px] md:rounded-[20px] lg:rounded-[24px] shadow-[0px_36px_30.9px_-27px_rgba(0,0,0,0.46),0px_4px_6px_-4px_rgba(0,0,0,0.1)] shrink-0 group cursor-pointer transition-all duration-300 hover:shadow-[0px_50px_40px_-30px_rgba(0,0,0,0.5),0px_8px_10px_-4px_rgba(0,0,0,0.15)]"
                  >
                    <div className="basis-0 content-stretch flex gap-[10px] grow items-start min-h-px min-w-px overflow-clip relative shrink-0 w-full">
                      <img 
                        alt={item.title} 
                        className="absolute inset-0 max-w-none object-cover pointer-events-none size-full transition-transform duration-500 group-hover:scale-110" 
                        src={item.thumbnailUrl}
                        referrerPolicy="no-referrer"
                        loading="lazy"
                        crossOrigin="anonymous"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                        <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6 text-white transform translate-y-4 group-hover:translate-y-0 transition-all duration-300">
                          <p className="font-['Roboto_Mono',_sans-serif] text-[9px] md:text-[10px] uppercase tracking-wider mb-1 md:mb-2 text-white/80">
                            {item.category || item.albumName}
                          </p>
                          <h3 className="font-['Anybody',_sans-serif] text-[13px] md:text-[15px] tracking-[-0.52px] md:tracking-[-0.6px]" style={{ fontVariationSettings: "'wdth' 137", fontWeight: 700 }}>
                            {item.title}
                          </h3>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )
            )}
          </div>
        </div>
      </div>

      {/* Lightbox Modal */}
      {activeAlbum && (
        <div 
          className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center px-4 md:px-8"
          onClick={() => setActiveAlbum(null)}
        >
          <div 
            className="bg-white rounded-[20px] md:rounded-[24px] max-w-5xl w-full max-h-[90vh] overflow-hidden flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 md:px-8 py-4 border-b border-black/5">
              <div className="flex flex-col gap-1">
                <h2
                  className="font-['Anybody',_sans-serif] text-[18px] md:text-[22px] tracking-[-0.7px] text-[#191919]"
                  style={{ fontVariationSettings: "'wdth' 137", fontWeight: 700 }}
                >
                  {activeAlbum.name}
                </h2>
                <p className="font-['Roboto_Mono',_sans-serif] text-[11px] md:text-[12px] text-[#6b6b6b] uppercase tracking-[0.12em]">
                  {activeAlbum.imageCount} {activeAlbum.imageCount === 1 ? 'photo' : 'photos'} · Cstle Livn installations
                </p>
              </div>
              <button
                type="button"
                onClick={() => setActiveAlbum(null)}
                className="h-9 w-9 rounded-full border border-black/10 flex items-center justify-center text-[20px] hover:bg-black hover:text-white transition-colors duration-150"
              >
                ×
              </button>
            </div>

            {/* Images Grid */}
            <div className="flex-1 overflow-y-auto px-5 md:px-8 py-5 md:py-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-5">
                {activeAlbum.images.map((image, index) => (
                  <div
                    key={image.id}
                    onClick={() => {
                      setActiveImageIndex(index);
                      setIsFullscreenOpen(true);
                    }}
                    className="relative w-full pb-[75%] overflow-hidden rounded-[14px] bg-[#f5f5f5] cursor-pointer group/thumb"
                  >
                    <img
                      src={image.thumbnailUrl}
                      alt={image.title}
                      referrerPolicy="no-referrer"
                      loading="lazy"
                      crossOrigin="anonymous"
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-200 group-hover/thumb:scale-105"
                    />
                    {image.title && (
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-3">
                        <p className="font-['Anybody',_sans-serif] text-white text-[11px] md:text-[12px] tracking-[-0.4px]" style={{ fontVariationSettings: "'wdth' 137", fontWeight: 600 }}>
                          {image.title}
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* In-album CTA */}
              <div className="mt-8 mb-2 bg-[#f5f5f5] rounded-[16px] px-6 py-8 flex flex-col items-center gap-[12px] text-center">
                <h3 className="font-['Anybody',_sans-serif] text-[#191919] text-[16px] md:text-[18px] tracking-[-0.64px]" style={{ fontVariationSettings: "'wdth' 137", fontWeight: 700 }}>
                  Planning something similar?
                </h3>
                <p className="font-['Anybody',_sans-serif] text-[#191919]/60 text-[13px] md:text-[14px] tracking-[-0.52px] max-w-[420px]" style={{ fontVariationSettings: "'wdth' 137", fontWeight: 500 }}>
                  Tell us about your space and what you would like to accomplish. {"We'll"} review the project and discuss the next step with you.
                </p>
                <div className="flex flex-col sm:flex-row gap-[8px] mt-2">
                  <Link
                    to="/book"
                    onClick={() => setActiveAlbum(null)}
                    className="bg-[#191919] rounded-[32px] px-[28px] py-[12px] font-['Roboto_Mono',_sans-serif] text-[11px] text-white uppercase hover:bg-black/90 transition-colors"
                  >
                    Request a Free Estimate
                  </Link>
                  <Link
                    to="/contact"
                    onClick={() => setActiveAlbum(null)}
                    className="font-['Roboto_Mono',_sans-serif] text-[11px] text-[#191919]/50 uppercase hover:text-[#191919] transition-colors px-[28px] py-[12px] flex items-center justify-center"
                  >
                    Contact Us
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Fullscreen Viewer */}
      {isFullscreenOpen && activeAlbum && (
        <div 
          className="fixed inset-0 z-[60] bg-black/95 flex items-center justify-center"
          onClick={() => setIsFullscreenOpen(false)}
        >
          {/* Close button */}
          <button
            type="button"
            onClick={() => setIsFullscreenOpen(false)}
            className="absolute top-4 right-4 h-10 w-10 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center text-white text-[24px] hover:bg-white/20 transition-all duration-150 z-10"
            aria-label="Close"
          >
            ×
          </button>

          {/* Previous button */}
          {activeAlbum.images.length > 1 && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                goPrev();
              }}
              className="absolute left-4 h-12 w-12 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center text-white hover:bg-white/20 transition-all duration-150 z-10"
              aria-label="Previous image"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
          )}

          {/* Image */}
          <div 
            className="max-h-[90vh] max-w-[90vw] flex flex-col items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={activeAlbum.images[activeImageIndex].url}
              alt={activeAlbum.images[activeImageIndex].title}
              referrerPolicy="no-referrer"
              crossOrigin="anonymous"
              className="max-h-[85vh] max-w-[90vw] object-contain rounded-lg"
            />
            {activeAlbum.images[activeImageIndex].title && (
              <p className="mt-4 font-['Anybody',_sans-serif] text-white text-[13px] md:text-[15px] tracking-[-0.4px] text-center" style={{ fontVariationSettings: "'wdth' 137", fontWeight: 600 }}>
                {activeAlbum.images[activeImageIndex].title}
              </p>
            )}
            <p className="mt-2 font-['Roboto_Mono',_sans-serif] text-white/60 text-[11px] uppercase tracking-[0.12em]">
              {activeImageIndex + 1} / {activeAlbum.images.length}
            </p>
          </div>

          {/* Next button */}
          {activeAlbum.images.length > 1 && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                goNext();
              }}
              className="absolute right-4 h-12 w-12 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center text-white hover:bg-white/20 transition-all duration-150 z-10"
              aria-label="Next image"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          )}
        </div>
      )}

      {/* Footer */}
      <Footer />
    </div>
  );
}
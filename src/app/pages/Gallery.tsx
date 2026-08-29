import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { galleryContent } from '../content/gallery-content';
import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { fetchGalleryAlbums, fetchGalleryItems, type GalleryAlbum, type GalleryItem } from '../lib/gallery';

type ProofProfile = {
  title: string;
  status: 'In progress' | 'Completed work';
  summary: string;
  services: string[];
};

const proofProfiles: Array<{ matches: RegExp; profile: ProofProfile }> = [
  {
    matches: /(project[-_ ]?001|renovation project 001|trombley)/i,
    profile: {
      title: 'Lower‑Level Finishing in Progress',
      status: 'In progress',
      summary: 'Selected Cstle work showing painting, door and trim installation, flooring transitions and bathroom finishing as the lower level takes shape.',
      services: ['Basement finishing', 'Painting', 'Flooring', 'Trim & doors', 'Bathrooms'],
    },
  },
  {
    matches: /(project[-_ ]?002|renovation project 002|lentil|daycare)/i,
    profile: {
      title: 'Basement Daycare Fit‑Out',
      status: 'In progress',
      summary: 'A practical lower level adapted for childcare, with durable surfaces, open circulation, a compact washroom and considered finishing details.',
      services: ['Basement finishing', 'Flooring', 'Trim & doors', 'Bathrooms', 'Installations'],
    },
  },
  {
    matches: /(project[-_ ]?003|renovation project 003|buckingham)/i,
    profile: {
      title: 'Lower‑Level Suite Finishing',
      status: 'In progress',
      summary: 'Selected Cstle finishing work across a compact lower-level suite, including kitchen, bathroom, living, flooring, door and trim details.',
      services: ['Basement finishing', 'Kitchens', 'Bathrooms', 'Flooring', 'Trim & doors'],
    },
  },
  {
    matches: /(project[-_ ]?004|p004|greenstone 1)/i,
    profile: {
      title: 'Lower‑Level Finish Continuity',
      status: 'In progress',
      summary: 'Late-stage Cstle work focused on consistent flooring, door and closet trim, hallway alignment and stair details across the lower level.',
      services: ['Basement finishing', 'Flooring', 'Trim & doors', 'Painting'],
    },
  },
  {
    matches: /(project[-_ ]?005|p005|greenstone 2)/i,
    profile: {
      title: 'Basement Finishing Transformation',
      status: 'In progress',
      summary: 'A before-and-progress sequence documenting organized flooring, trim and stair installation as the basement moves toward its finished state.',
      services: ['Basement finishing', 'Flooring', 'Trim & doors', 'Painting'],
    },
  },
  {
    matches: /(project[-_ ]?009|p009|stapleford)/i,
    profile: {
      title: 'Basement Progress to Finish',
      status: 'Completed work',
      summary: 'A real progress-to-result sequence showing drywall finishing, flooring, painting, stair work and kitchenette installation in Saskatchewan.',
      services: ['Basement finishing', 'Flooring', 'Painting', 'Trim & doors', 'Installations'],
    },
  },
];

const serviceFilters = ['All projects', 'Basement finishing', 'Flooring', 'Painting', 'Trim & doors', 'Bathrooms', 'Kitchens'];

function proofProfileFor(album: GalleryAlbum): ProofProfile | null {
  const searchable = `${album.slug} ${album.name}`;
  return proofProfiles.find(({ matches }) => matches.test(searchable))?.profile ?? null;
}

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
  const [activeService, setActiveService] = useState('All projects');

  useEffect(() => {
    const gallerySchema = document.createElement('script');
    gallerySchema.type = 'application/ld+json';
    gallerySchema.dataset.cstleSeo = 'project-gallery';
    gallerySchema.textContent = JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'CollectionPage',
      '@id': 'https://www.cstle.ca/gallery#collection',
      name: 'Cstle Construction Project Gallery',
      url: 'https://www.cstle.ca/gallery',
      description: galleryContent.hero.subtitle,
      about: ['Basement finishing', 'Renovations', 'Flooring', 'Painting', 'Trim and doors', 'Bathrooms', 'Kitchens'],
      provider: { '@id': 'https://www.cstle.ca/#business' },
      mainEntity: {
        '@type': 'ItemList',
        itemListElement: proofProfiles.map(({ profile }, index) => ({
          '@type': 'ListItem',
          position: index + 1,
          item: {
            '@type': 'CreativeWork',
            name: profile.title.replaceAll('‑', '-'),
            description: profile.summary,
            about: profile.services,
          },
        })),
      },
    });
    document.head.appendChild(gallerySchema);
    return () => gallerySchema.remove();
  }, []);

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

  const visibleAlbums = activeService === 'All projects'
    ? albums
    : albums.filter((album) => proofProfileFor(album)?.services.includes(activeService));

  return (
    <div className="bg-white content-stretch flex flex-col gap-[40px] md:gap-[69px] items-start relative min-h-screen w-full">
      {/* Header Section */}
      <div className="bg-gradient-to-b from-[#d9d9d9] to-[#ffffff] w-full">
        <div className="flex flex-col items-center size-full">
          <div className="box-border content-stretch flex flex-col gap-[40px] md:gap-[80px] items-center px-px py-[28px] md:py-[56px] relative w-full">
            <Header />
            
            <div className="box-border content-stretch flex flex-col items-center px-[20px] md:px-[16px] py-0 relative w-full max-w-[820px]">
              <div className="relative shrink-0 w-full">
                <div className="flex flex-row items-center justify-center size-full">
                  <div className="box-border content-stretch flex gap-[10px] items-center justify-center px-[10px] md:px-[23px] py-0 relative w-full">
                    <h1 className="brand-heading brand-heading--hero relative text-center hyphens-none">
                      {galleryContent.hero.title}
                    </h1>
                  </div>
                </div>
              </div>
              <div className="relative shrink-0 w-full">
                <div className="flex flex-row items-center justify-center size-full">
                  <div className="box-border flex items-center justify-center px-[10px] pt-[14px] relative w-full">
                    <p className="max-w-[680px] font-['Anybody',_sans-serif] text-[#191919]/65 text-[14px] md:text-[16px] text-center tracking-[-0.035em] leading-[1.55]" style={{ fontVariationSettings: "'wdth' 137", fontWeight: 500 }}>
                      {galleryContent.hero.subtitle}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {!loading && albums.length > 0 && viewMode === 'albums' && (
        <section className="w-full max-w-[1800px] mx-auto px-[20px] md:px-[40px] lg:px-[60px]" aria-label="Filter projects by service">
          <div className="border-y border-black/[0.08] py-5 flex flex-wrap items-center gap-2">
            <span className="mr-2 font-['Roboto_Mono',_sans-serif] text-[9px] font-bold uppercase tracking-[0.13em] text-[#191919]/50">Explore by service</span>
            {serviceFilters.map((service) => (
              <button
                key={service}
                type="button"
                onClick={() => setActiveService(service)}
                aria-pressed={activeService === service}
                className={`rounded-full border px-4 py-2 font-['Roboto_Mono',_sans-serif] text-[9px] font-bold uppercase tracking-[0.04em] transition-colors ${activeService === service ? 'border-[#536329] bg-[#536329] text-white' : 'border-black/10 bg-white text-[#191919]/65 hover:border-[#536329]/45 hover:text-[#536329]'}`}
              >
                {service}
              </button>
            ))}
          </div>
        </section>
      )}

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
          <div className="box-border grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-[20px] md:gap-[30px] lg:gap-[40px] items-stretch justify-center px-[20px] md:px-[40px] lg:px-[60px] py-0 relative w-full">
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
              visibleAlbums.length === 0 ? (
                <div className="text-center py-20 col-span-full flex flex-col items-center gap-[24px]">
                  <h2 className="font-['Anybody',_sans-serif] text-[#191919] text-[22px] md:text-[28px] tracking-[-0.88px]" style={{ fontVariationSettings: "'wdth' 137", fontWeight: 700 }}>
                    No projects match this service yet.
                  </h2>
                  <p className="font-['Anybody',_sans-serif] text-[#191919]/70 text-[14px] md:text-[15px] tracking-[-0.56px] max-w-[500px]" style={{ fontVariationSettings: "'wdth' 137", fontWeight: 500 }}>
                    Choose another service or view all projects. We only tag work when the available project record supports it.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-[10px]">
                    <button type="button" onClick={() => setActiveService('All projects')} className="bg-[#191919] rounded-[32px] px-[32px] py-[14px] font-['Roboto_Mono',_sans-serif] text-[12px] text-white uppercase hover:bg-black/90 transition-colors">View all projects</button>
                  </div>
                </div>
              ) : (
                visibleAlbums.map((album) => {
                  const profile = proofProfileFor(album);
                  return (
                  <div 
                    key={album.id}
                    onClick={() => setActiveAlbum(album)}
                    className="bg-white box-border flex h-full flex-col min-h-[440px] items-start overflow-hidden relative rounded-[18px] md:rounded-[22px] border border-black/[0.06] shadow-[0_8px_26px_rgba(0,0,0,0.06)] group cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:border-[#536329]/25 hover:shadow-[0_22px_50px_rgba(0,0,0,0.11)]"
                  >
                    <div className="h-[260px] overflow-hidden relative shrink-0 w-full">
                      <AlbumCoverImage album={album} />
                      <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/45 to-transparent pointer-events-none" />
                      <p className="absolute bottom-4 left-4 rounded-full bg-black/70 px-3 py-1.5 font-['Roboto_Mono',_sans-serif] text-[8px] font-bold uppercase tracking-[0.09em] text-white backdrop-blur-sm">{profile?.status ?? `${album.imageCount} photos`}</p>
                    </div>
                    <div className="flex flex-1 flex-col p-5 md:p-6 w-full">
                      <p className="font-['Roboto_Mono',_sans-serif] text-[8px] font-bold uppercase tracking-[0.12em] text-[#536329]">Selected Cstle work · {album.imageCount} {album.imageCount === 1 ? 'image' : 'images'}</p>
                      <h3 className="brand-heading brand-heading--card mt-3">{profile?.title ?? album.name}</h3>
                      {profile ? (
                        <>
                          <p className="mt-3 font-['Anybody',_sans-serif] text-[12px] leading-[1.5] tracking-[-0.02em] text-[#191919]/60" style={{ fontVariationSettings: "'wdth' 137", fontWeight: 500 }}>{profile.summary}</p>
                          <div className="mt-auto pt-5 flex flex-wrap gap-1.5">{profile.services.slice(0, 3).map((service) => <span key={service} className="rounded-full bg-[#eef1e3] px-2.5 py-1 font-['Roboto_Mono',_sans-serif] text-[7px] font-bold uppercase tracking-[0.04em] text-[#536329]">{service}</span>)}</div>
                        </>
                      ) : <p className="mt-3 font-['Anybody',_sans-serif] text-[12px] leading-[1.5] text-[#191919]/55" style={{ fontVariationSettings: "'wdth' 137", fontWeight: 500 }}>Open this project to review the available work photographs.</p>}
                    </div>
                  </div>
                  );
                })
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
                  {proofProfileFor(activeAlbum)?.title ?? activeAlbum.name}
                </h2>
                <p className="font-['Roboto_Mono',_sans-serif] text-[11px] md:text-[12px] text-[#6b6b6b] uppercase tracking-[0.12em]">
                  {proofProfileFor(activeAlbum)?.status ?? 'Selected work'} · {activeAlbum.imageCount} {activeAlbum.imageCount === 1 ? 'photo' : 'photos'}
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
              {proofProfileFor(activeAlbum) && (
                <div className="mb-6 max-w-[760px]">
                  <p className="font-['Anybody',_sans-serif] text-[14px] leading-[1.55] tracking-[-0.02em] text-[#191919]/65" style={{ fontVariationSettings: "'wdth' 137", fontWeight: 500 }}>{proofProfileFor(activeAlbum)?.summary}</p>
                  <div className="mt-4 flex flex-wrap gap-2">{proofProfileFor(activeAlbum)?.services.map((service) => <span key={service} className="rounded-full bg-[#eef1e3] px-3 py-1.5 font-['Roboto_Mono',_sans-serif] text-[8px] font-bold uppercase tracking-[0.04em] text-[#536329]">{service}</span>)}</div>
                </div>
              )}
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

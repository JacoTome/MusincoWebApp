package musinco.webapp.java_backend.services;

import jakarta.transaction.Transactional;
import musinco.webapp.java_backend.models.Artist;
import musinco.webapp.java_backend.repositories.ArtistRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
@Transactional
public class ArtistService {
    private static final Logger log = LoggerFactory.getLogger(ArtistService.class);

    @Autowired
    private ArtistRepository artistRepository;

    public Artist registerNewArtist(String artist_name) {
        log.info("Registering artist: {}", artist_name);
        Artist artist = new Artist();
        artist.setArtistName(artist_name);
        return artistRepository.save(artist);
    }
    public Boolean checkArtistExists(String artist_name) {
        return artistRepository.findFirstByArtistName(artist_name) != null;
    }
}

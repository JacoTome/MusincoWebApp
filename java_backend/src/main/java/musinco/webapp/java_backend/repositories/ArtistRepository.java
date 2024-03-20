package musinco.webapp.java_backend.repositories;

import musinco.webapp.java_backend.models.Artist;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.CrudRepository;

public interface ArtistRepository extends JpaRepository<Artist, Long> {

    Artist findArtistByArtistName(String artistName);
    Artist findFirstByArtistName(String artistName);
}

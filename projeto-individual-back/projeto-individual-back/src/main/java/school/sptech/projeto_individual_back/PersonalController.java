package school.sptech.projeto_individual_back;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.http.ResponseEntity;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/personais")
public class PersonalController {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @GetMapping
    public ResponseEntity<List<Usuario>> listar() {

        String sql = "SELECT * FROM usuario WHERE tipo = 'PERSONAL' ORDER BY nome;";

        List<Usuario> personais = jdbcTemplate.query(sql, new BeanPropertyRowMapper<>(Usuario.class));

        if (personais.isEmpty()) {
            return ResponseEntity.status(204).build();
        }

        for (int i = 0; i < personais.size(); i++) {
            Usuario personal = personais.get(i);
            personal.setSenha(null);
            personal.setMediaEstrelas(calcularMedia(personal.getId()));
        }

        return ResponseEntity.status(200).body(personais);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Usuario> listarPorId(@PathVariable int id) {

        String sql = "SELECT * FROM usuario WHERE id = ? AND tipo = 'PERSONAL';";

        try {
            Usuario personal = jdbcTemplate.queryForObject(sql,
                    new BeanPropertyRowMapper<>(Usuario.class), id);

            personal.setSenha(null);
            personal.setMediaEstrelas(calcularMedia(id));

            return ResponseEntity.status(200).body(personal);
        } catch (EmptyResultDataAccessException e) {
            return ResponseEntity.status(404).build();
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<Usuario> atualizarPerfil(@PathVariable int id,
                                                   @RequestBody Usuario perfil) {

        if (!existePersonal(id)) {
            return ResponseEntity.status(404).build();
        }

        if (perfil.getDescricao() == null || perfil.getDescricao().isBlank()) {
            return ResponseEntity.status(400).build();
        }

        if (perfil.getAnosExperiencia() == null || perfil.getAnosExperiencia() < 0) {
            return ResponseEntity.status(400).build();
        }

        String sql = "UPDATE usuario SET foto_url = ?, anos_experiencia = ?, modalidade = ?, "
                + "especialidade = ?, descricao = ? WHERE id = ?;";

        jdbcTemplate.update(sql, perfil.getFotoUrl(), perfil.getAnosExperiencia(),
                perfil.getModalidade(), perfil.getEspecialidade(), perfil.getDescricao(), id);

        return listarPorId(id);
    }

    private Boolean existePersonal(int id) {
        String sql = "SELECT COUNT(*) FROM usuario WHERE id = ? AND tipo = 'PERSONAL';";
        Integer total = jdbcTemplate.queryForObject(sql, Integer.class, id);
        return total == 1;
    }

    private Double calcularMedia(int personalId) {
        String sql = "SELECT AVG(CAST(a.estrelas AS DOUBLE)) FROM avaliacao a "
                + "JOIN plano p ON p.id = a.plano_id WHERE p.personal_id = ?;";

        Double media = jdbcTemplate.queryForObject(sql, Double.class, personalId);

        if (media == null) {
            return 0.0;
        }

        return media;
    }
}
package school.sptech.projeto_individual_back;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.support.GeneratedKeyHolder;
import org.springframework.jdbc.support.KeyHolder;
import org.springframework.web.bind.annotation.*;

import java.sql.PreparedStatement;
import java.sql.Statement;
import java.util.List;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/contratacoes")
public class ContratacaoController {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @GetMapping("/personal/{personalId}")
    public ResponseEntity<List<Contratacao>> listarPorPersonal(@PathVariable int personalId) {

        String sql = "SELECT c.id, c.aluno_id, c.personal_id, c.data_inicio, "
                + "u.nome AS aluno_nome FROM contratacao c "
                + "JOIN usuario u ON u.id = c.aluno_id WHERE c.personal_id = ?;";

        List<Contratacao> contratacoes = jdbcTemplate.query(sql,
                new BeanPropertyRowMapper<>(Contratacao.class), personalId);

        if (contratacoes.isEmpty()) {
            return ResponseEntity.status(204).build();
        }

        return ResponseEntity.status(200).body(contratacoes);
    }

    @GetMapping("/aluno/{alunoId}")
    public ResponseEntity<List<Contratacao>> listarPorAluno(@PathVariable int alunoId) {

        String sql = "SELECT c.id, c.aluno_id, c.personal_id, c.data_inicio, "
                + "u.nome AS personal_nome FROM contratacao c "
                + "JOIN usuario u ON u.id = c.personal_id WHERE c.aluno_id = ?;";

        List<Contratacao> contratacoes = jdbcTemplate.query(sql,
                new BeanPropertyRowMapper<>(Contratacao.class), alunoId);

        if (contratacoes.isEmpty()) {
            return ResponseEntity.status(204).build();
        }

        return ResponseEntity.status(200).body(contratacoes);
    }

    @PostMapping
    public ResponseEntity<Contratacao> contratar(@RequestBody Contratacao contratacao) {

        if (contratacao.getAlunoId() == null || contratacao.getPersonalId() == null) {
            return ResponseEntity.status(400).build();
        }

        if (contratacao.getDataInicio() == null || contratacao.getDataInicio().isBlank()) {
            return ResponseEntity.status(400).build();
        }

        if (!existeUsuario(contratacao.getAlunoId(), "ALUNO")) {
            return ResponseEntity.status(404).build();
        }

        if (!existeUsuario(contratacao.getPersonalId(), "PERSONAL")) {
            return ResponseEntity.status(404).build();
        }

        if (jaContratou(contratacao.getAlunoId(), contratacao.getPersonalId())) {
            return ResponseEntity.status(409).build();
        }

        String sql = "INSERT INTO contratacao (aluno_id, personal_id, data_inicio) "
                + "VALUES (?, ?, ?);";

        KeyHolder keyHolder = new GeneratedKeyHolder();

        jdbcTemplate.update(con -> {
            PreparedStatement ps = con.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS);
            ps.setInt(1, contratacao.getAlunoId());
            ps.setInt(2, contratacao.getPersonalId());
            ps.setString(3, contratacao.getDataInicio());
            return ps;
        }, keyHolder);

        Integer idInserido = keyHolder.getKeyAs(Integer.class);
        contratacao.setId(idInserido);

        return ResponseEntity.status(201).body(contratacao);
    }

    private Boolean existeUsuario(int id, String tipo) {
        String sql = "SELECT COUNT(*) FROM usuario WHERE id = ? AND tipo = ?;";
        Integer total = jdbcTemplate.queryForObject(sql, Integer.class, id, tipo);
        return total == 1;
    }

    private Boolean jaContratou(int alunoId, int personalId) {
        String sql = "SELECT COUNT(*) FROM contratacao WHERE aluno_id = ? AND personal_id = ?;";
        Integer total = jdbcTemplate.queryForObject(sql, Integer.class, alunoId, personalId);
        return total > 0;
    }
}
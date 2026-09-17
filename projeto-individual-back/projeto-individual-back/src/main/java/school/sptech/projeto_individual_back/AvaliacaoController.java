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
@RequestMapping("/avaliacoes")
public class AvaliacaoController {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @GetMapping("/plano/{planoId}")
    public ResponseEntity<List<Avaliacao>> listarPorPlano(@PathVariable int planoId) {

        String sql = "SELECT * FROM avaliacao WHERE plano_id = ?;";

        List<Avaliacao> avaliacoes = jdbcTemplate.query(sql,
                new BeanPropertyRowMapper<>(Avaliacao.class), planoId);

        if (avaliacoes.isEmpty()) {
            return ResponseEntity.status(204).build();
        }

        return ResponseEntity.status(200).body(avaliacoes);
    }

    @GetMapping("/personal/{personalId}")
    public ResponseEntity<List<Avaliacao>> listarPorPersonal(@PathVariable int personalId) {

        String sql = "SELECT a.* FROM avaliacao a JOIN plano p ON p.id = a.plano_id "
                + "WHERE p.personal_id = ?;";

        List<Avaliacao> avaliacoes = jdbcTemplate.query(sql,
                new BeanPropertyRowMapper<>(Avaliacao.class), personalId);

        if (avaliacoes.isEmpty()) {
            return ResponseEntity.status(204).build();
        }

        return ResponseEntity.status(200).body(avaliacoes);
    }

    @PostMapping
    public ResponseEntity<Avaliacao> avaliar(@RequestBody Avaliacao avaliacao) {

        if (avaliacao.getEstrelas() == null) {
            return ResponseEntity.status(400).build();
        }

        if (avaliacao.getEstrelas() < 1 || avaliacao.getEstrelas() > 5) {
            return ResponseEntity.status(400).build();
        }

        if (avaliacao.getAlunoId() == null || !existeAluno(avaliacao.getAlunoId())) {
            return ResponseEntity.status(404).build();
        }

        if (avaliacao.getPlanoId() == null || !existePlano(avaliacao.getPlanoId())) {
            return ResponseEntity.status(404).build();
        }

        if (jaAvaliou(avaliacao.getAlunoId(), avaliacao.getPlanoId())) {
            String sqlUpdate = "UPDATE avaliacao SET estrelas = ? WHERE aluno_id = ? AND plano_id = ?;";

            jdbcTemplate.update(sqlUpdate, avaliacao.getEstrelas(),
                    avaliacao.getAlunoId(), avaliacao.getPlanoId());

            return ResponseEntity.status(200).body(avaliacao);
        }

        String sql = "INSERT INTO avaliacao (aluno_id, plano_id, estrelas) VALUES (?, ?, ?);";

        KeyHolder keyHolder = new GeneratedKeyHolder();

        jdbcTemplate.update(con -> {
            PreparedStatement ps = con.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS);
            ps.setInt(1, avaliacao.getAlunoId());
            ps.setInt(2, avaliacao.getPlanoId());
            ps.setInt(3, avaliacao.getEstrelas());
            return ps;
        }, keyHolder);

        Integer idInserido = keyHolder.getKeyAs(Integer.class);
        avaliacao.setId(idInserido);

        return ResponseEntity.status(201).body(avaliacao);
    }

    private Boolean existeAluno(int id) {
        String sql = "SELECT COUNT(*) FROM usuario WHERE id = ? AND tipo = 'ALUNO';";
        Integer total = jdbcTemplate.queryForObject(sql, Integer.class, id);
        return total == 1;
    }

    private Boolean existePlano(int id) {
        String sql = "SELECT COUNT(*) FROM plano WHERE id = ?;";
        Integer total = jdbcTemplate.queryForObject(sql, Integer.class, id);
        return total == 1;
    }

    private Boolean jaAvaliou(int alunoId, int planoId) {
        String sql = "SELECT COUNT(*) FROM avaliacao WHERE aluno_id = ? AND plano_id = ?;";
        Integer total = jdbcTemplate.queryForObject(sql, Integer.class, alunoId, planoId);
        return total > 0;
    }
}
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
@RequestMapping("/planos")
public class PlanoController {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @GetMapping("/personal/{personalId}")
    public ResponseEntity<List<Plano>> listarPorPersonal(@PathVariable int personalId) {

        String sql = "SELECT * FROM plano WHERE personal_id = ? ORDER BY id;";

        List<Plano> planos = jdbcTemplate.query(sql,
                new BeanPropertyRowMapper<>(Plano.class), personalId);

        if (planos.isEmpty()) {
            return ResponseEntity.status(204).build();
        }

        return ResponseEntity.status(200).body(planos);
    }

    @GetMapping("/personal/{personalId}/categoria/{categoria}")
    public ResponseEntity<List<Plano>> listarPorCategoria(@PathVariable int personalId,
                                                          @PathVariable String categoria) {

        String sql = "SELECT * FROM plano WHERE personal_id = ? AND categoria = ? ORDER BY id;";

        List<Plano> planos = jdbcTemplate.query(sql,
                new BeanPropertyRowMapper<>(Plano.class), personalId, categoria);

        if (planos.isEmpty()) {
            return ResponseEntity.status(204).build();
        }

        return ResponseEntity.status(200).body(planos);
    }

    @PostMapping
    public ResponseEntity<Plano> cadastrar(@RequestBody Plano plano) {

        if (plano.getTitulo() == null || plano.getTitulo().isBlank()) {
            return ResponseEntity.status(400).build();
        }

        if (!categoriaValida(plano.getCategoria())) {
            return ResponseEntity.status(400).build();
        }

        if (!nivelValido(plano.getNivel())) {
            return ResponseEntity.status(400).build();
        }

        if (plano.getDuracaoSemanas() == null) {
            return ResponseEntity.status(400).build();
        }

        if (plano.getDuracaoSemanas() < 1 || plano.getDuracaoSemanas() > 52) {
            return ResponseEntity.status(400).build();
        }

        if (plano.getPersonalId() == null || !existePersonal(plano.getPersonalId())) {
            return ResponseEntity.status(404).build();
        }

        String sql = "INSERT INTO plano (personal_id, titulo, categoria, nivel, duracao_semanas, "
                + "objetivo, descricao) VALUES (?, ?, ?, ?, ?, ?, ?);";

        KeyHolder keyHolder = new GeneratedKeyHolder();

        jdbcTemplate.update(con -> {
            PreparedStatement ps = con.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS);
            ps.setInt(1, plano.getPersonalId());
            ps.setString(2, plano.getTitulo());
            ps.setString(3, plano.getCategoria());
            ps.setString(4, plano.getNivel());
            ps.setInt(5, plano.getDuracaoSemanas());
            ps.setString(6, plano.getObjetivo());
            ps.setString(7, plano.getDescricao());
            return ps;
        }, keyHolder);

        Integer idInserido = keyHolder.getKeyAs(Integer.class);
        plano.setId(idInserido);

        return ResponseEntity.status(201).body(plano);
    }

    @GetMapping("/{id}/treinos")
    public ResponseEntity<List<Treino>> listarTreinos(@PathVariable int id) {

        if (!existePlano(id)) {
            return ResponseEntity.status(404).build();
        }

        String sql = "SELECT * FROM treino WHERE plano_id = ? ORDER BY id;";

        List<Treino> treinos = jdbcTemplate.query(sql,
                new BeanPropertyRowMapper<>(Treino.class), id);

        if (treinos.isEmpty()) {
            return ResponseEntity.status(204).build();
        }

        return ResponseEntity.status(200).body(treinos);
    }

    @PostMapping("/{id}/treinos")
    public ResponseEntity<Treino> cadastrarTreino(@PathVariable int id,
                                                  @RequestBody Treino treino) {

        if (!existePlano(id)) {
            return ResponseEntity.status(404).build();
        }

        if (treino.getNome() == null || treino.getNome().isBlank()) {
            return ResponseEntity.status(400).build();
        }

        if (treino.getExercicios() == null || treino.getExercicios().isBlank()) {
            return ResponseEntity.status(400).build();
        }

        String sql = "INSERT INTO treino (plano_id, nome, dia_semana, exercicios, observacoes) "
                + "VALUES (?, ?, ?, ?, ?);";

        KeyHolder keyHolder = new GeneratedKeyHolder();

        jdbcTemplate.update(con -> {
            PreparedStatement ps = con.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS);
            ps.setInt(1, id);
            ps.setString(2, treino.getNome());
            ps.setString(3, treino.getDiaSemana());
            ps.setString(4, treino.getExercicios());
            ps.setString(5, treino.getObservacoes());
            return ps;
        }, keyHolder);

        Integer idInserido = keyHolder.getKeyAs(Integer.class);
        treino.setId(idInserido);
        treino.setPlanoId(id);

        return ResponseEntity.status(201).body(treino);
    }

    private Boolean categoriaValida(String categoria) {
        if (categoria == null) {
            return false;
        }

        return categoria.equals("EMAGRECIMENTO")
                || categoria.equals("HIPERTROFIA")
                || categoria.equals("CONDICIONAMENTO")
                || categoria.equals("REABILITACAO");
    }

    private Boolean nivelValido(String nivel) {
        if (nivel == null) {
            return false;
        }

        return nivel.equals("INICIANTE")
                || nivel.equals("INTERMEDIARIO")
                || nivel.equals("AVANCADO");
    }

    private Boolean existePersonal(int id) {
        String sql = "SELECT COUNT(*) FROM usuario WHERE id = ? AND tipo = 'PERSONAL';";
        Integer total = jdbcTemplate.queryForObject(sql, Integer.class, id);
        return total == 1;
    }

    private Boolean existePlano(int id) {
        String sql = "SELECT COUNT(*) FROM plano WHERE id = ?;";
        Integer total = jdbcTemplate.queryForObject(sql, Integer.class, id);
        return total == 1;
    }
}
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
@RequestMapping("/usuarios")
public class UsuarioController {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @PostMapping
    public ResponseEntity<Usuario> cadastrar(@RequestBody Usuario usuario) {

        if (usuario.getNome() == null || usuario.getNome().isBlank()) {
            return ResponseEntity.status(400).build();
        }

        if (usuario.getEmail() == null || !usuario.getEmail().contains("@")) {
            return ResponseEntity.status(400).build();
        }

        if (usuario.getSenha() == null || usuario.getSenha().length() < 8) {
            return ResponseEntity.status(400).build();
        }

        if (usuario.getTipo() == null) {
            return ResponseEntity.status(400).build();
        }

        if (!usuario.getTipo().equals("ALUNO") && !usuario.getTipo().equals("PERSONAL")) {
            return ResponseEntity.status(400).build();
        }

        if (existeEmail(usuario.getEmail())) {
            return ResponseEntity.status(409).build();
        }

        String sql = "INSERT INTO usuario (nome, email, senha, telefone, data_nascimento, tipo) "
                + "VALUES (?, ?, ?, ?, ?, ?);";

        KeyHolder keyHolder = new GeneratedKeyHolder();

        jdbcTemplate.update(con -> {
            PreparedStatement ps = con.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS);
            ps.setString(1, usuario.getNome());
            ps.setString(2, usuario.getEmail());
            ps.setString(3, usuario.getSenha());
            ps.setString(4, usuario.getTelefone());
            ps.setString(5, usuario.getDataNascimento());
            ps.setString(6, usuario.getTipo());
            return ps;
        }, keyHolder);

        Integer idInserido = keyHolder.getKeyAs(Integer.class);
        usuario.setId(idInserido);
        usuario.setSenha(null);

        return ResponseEntity.status(201).body(usuario);
    }

    @PostMapping("/login")
    public ResponseEntity<Usuario> login(@RequestBody Login login) {

        if (login.getEmail() == null || login.getSenha() == null) {
            return ResponseEntity.status(400).build();
        }

        String sql = "SELECT * FROM usuario WHERE email = ? AND senha = ?;";

        List<Usuario> usuarios = jdbcTemplate.query(sql,
                new BeanPropertyRowMapper<>(Usuario.class), login.getEmail(), login.getSenha());

        if (usuarios.isEmpty()) {
            return ResponseEntity.status(404).build();
        }

        Usuario encontrado = usuarios.get(0);
        encontrado.setSenha(null);

        return ResponseEntity.status(200).body(encontrado);
    }

    private Boolean existeEmail(String email) {
        String sql = "SELECT COUNT(*) FROM usuario WHERE email = ?;";
        Integer total = jdbcTemplate.queryForObject(sql, Integer.class, email);
        return total > 0;
    }
}
package school.sptech.projeto_individual_back;

public class Plano {

    private Integer id;
    private Integer personalId;
    private String titulo;
    private String categoria;
    private String nivel;
    private Integer duracaoSemanas;
    private String objetivo;
    private String descricao;

    public Plano() {
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public Integer getPersonalId() {
        return personalId;
    }

    public void setPersonalId(Integer personalId) {
        this.personalId = personalId;
    }

    public String getTitulo() {
        return titulo;
    }

    public void setTitulo(String titulo) {
        this.titulo = titulo;
    }

    public String getCategoria() {
        return categoria;
    }

    public void setCategoria(String categoria) {
        this.categoria = categoria;
    }

    public String getNivel() {
        return nivel;
    }

    public void setNivel(String nivel) {
        this.nivel = nivel;
    }

    public Integer getDuracaoSemanas() {
        return duracaoSemanas;
    }

    public void setDuracaoSemanas(Integer duracaoSemanas) {
        this.duracaoSemanas = duracaoSemanas;
    }

    public String getObjetivo() {
        return objetivo;
    }

    public void setObjetivo(String objetivo) {
        this.objetivo = objetivo;
    }

    public String getDescricao() {
        return descricao;
    }

    public void setDescricao(String descricao) {
        this.descricao = descricao;
    }
}
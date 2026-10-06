"""The old ``claude_spine`` import path must resolve to the same modules."""


def test_alias_same_module_objects():
    import art_pipeline.mesh as new
    import claude_spine.mesh as old

    assert old is new


def test_alias_server_and_name():
    from art_pipeline.server import mcp
    from claude_spine.server import mcp as old_mcp

    assert old_mcp is mcp
    assert mcp.name == "art-pipeline"
